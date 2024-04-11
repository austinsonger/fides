/* eslint-disable no-nested-ternary */
import { h, FunctionComponent, VNode } from "preact";
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "preact/hooks";

import { useA11yDialog } from "../lib/a11y-dialog";
import {
  ComponentType,
  NoticeConsent,
  FidesCookie,
  FidesInitOptions,
  PrivacyExperience,
} from "../lib/consent-types";
import {
  debugLog,
  defaultShowModal,
  shouldResurfaceConsent,
} from "../lib/consent-utils";
import { dispatchFidesEvent } from "../lib/events";
import { useHasMounted } from "../lib/hooks";
import type { I18n } from "../lib/i18n";

import ConsentModal from "./ConsentModal";
import ConsentContent from "./ConsentContent";
import "./fides.css";
import { blockPageScrolling, unblockPageScrolling } from "../lib/ui-utils";
import { FIDES_OVERLAY_WRAPPER } from "../lib/consent-constants";

interface RenderBannerProps {
  isOpen: boolean;
  isEmbedded: boolean;
  onClose: () => void;
  onSave: () => void;
  onManagePreferencesClick: () => void;
}

interface RenderModalFooterProps {
  onClose: () => void;
  isMobile: boolean;
}

interface Props {
  options: FidesInitOptions;
  experience: PrivacyExperience;
  i18n: I18n;
  cookie: FidesCookie;
  savedConsent: NoticeConsent;
  onOpen: () => void;
  onDismiss: () => void;
  renderBanner: (props: RenderBannerProps) => VNode | null;
  renderModalContent: () => VNode;
  renderModalFooter: (props: RenderModalFooterProps) => VNode;
  onVendorPageClick?: () => void;
  isUiBlocking: boolean;
}

const Overlay: FunctionComponent<Props> = ({
  options,
  experience,
  i18n,
  cookie,
  savedConsent,
  onOpen,
  onDismiss,
  renderBanner,
  renderModalContent,
  renderModalFooter,
  onVendorPageClick,
  isUiBlocking,
}) => {
  const delayBannerMilliseconds = 100;
  const delayModalLinkMilliseconds = 200;
  const hasMounted = useHasMounted();

  const showBanner = useMemo(
    () =>
      !options.fidesDisableBanner &&
      experience.experience_config?.component !== ComponentType.MODAL &&
      shouldResurfaceConsent(experience, cookie, savedConsent),
    [cookie, savedConsent, experience, options]
  );

  const [bannerIsOpen, setBannerIsOpen] = useState(
    options.fidesEmbed ? showBanner : false
  );
  const modalLinkRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isUiBlocking && bannerIsOpen) {
      blockPageScrolling();
    } else {
      unblockPageScrolling();
    }

    return () => {
      unblockPageScrolling();
    };
  }, [isUiBlocking, bannerIsOpen]);

  const dispatchCloseEvent = useCallback(
    ({ saved = false }: { saved?: boolean }) => {
      dispatchFidesEvent("FidesModalClosed", cookie, options.debug, { saved });
      if (!saved) {
        onDismiss();
      }
    },
    [cookie, onDismiss, options.debug]
  );

  const { instance, attributes } = useA11yDialog({
    id: "fides-modal",
    role: "alertdialog",
    title: i18n.t("exp.title"),
    onClose: () => {
      dispatchCloseEvent({ saved: false });
    },
  });

  const handleOpenModal = useCallback(() => {
    if (options.fidesEmbed) {
      setBannerIsOpen(false);
    } else if (instance) {
      setBannerIsOpen(false);
      instance.show();
      onOpen();
    }
  }, [instance, onOpen, options]);

  const handleCloseModalAfterSave = useCallback(() => {
    if (instance && !options.fidesEmbed) {
      instance.hide();
      dispatchCloseEvent({ saved: true });
    }
  }, [instance, dispatchCloseEvent, options.fidesEmbed]);

  useEffect(() => {
    if (options.fidesEmbed && !bannerIsOpen) {
      onOpen();
    }
  }, [options, onOpen, bannerIsOpen]);

  // The delay is needed for the banner CSS animation
  useEffect(() => {
    const delayBanner = setTimeout(() => {
      if (showBanner) {
        setBannerIsOpen(true);
      }
    }, delayBannerMilliseconds);
    return () => clearTimeout(delayBanner);
  }, [showBanner, setBannerIsOpen]);

  useEffect(() => {
    window.Fides.showModal = handleOpenModal;
    document.body.classList.add("fides-overlay-modal-link-shown");
    // use a delay to ensure that link exists in the DOM
    const delayModalLinkBinding = setTimeout(() => {
      const modalLinkId = options.modalLinkId || "fides-modal-link";
      const modalLinkEl = document.getElementById(modalLinkId);
      if (modalLinkEl) {
        debugLog(
          options.debug,
          "Modal link element found, updating it to show and trigger modal on click."
        );
        modalLinkRef.current = modalLinkEl;
        modalLinkRef.current.addEventListener("click", window.Fides.showModal);
        // Update to show the pre-existing modal link in the DOM
        modalLinkRef.current.classList.add("fides-modal-link-shown");
      } else {
        debugLog(options.debug, "Modal link element not found.");
      }
    }, delayModalLinkMilliseconds);
    return () => {
      clearTimeout(delayModalLinkBinding);
      if (modalLinkRef.current) {
        modalLinkRef.current.removeEventListener(
          "click",
          window.Fides.showModal
        );
      }
      window.Fides.showModal = defaultShowModal;
    };
  }, [options.modalLinkId, options.debug, handleOpenModal, experience]);

  const handleManagePreferencesClick = (): void => {
    handleOpenModal();
  };

  if (!hasMounted) {
    return null;
  }

  if (!experience.experience_config) {
    debugLog(options.debug, "No experience config found");
    return null;
  }

  return (
    <div id={FIDES_OVERLAY_WRAPPER} tabIndex={-1}>
      {showBanner && bannerIsOpen && isUiBlocking && (
        <div className="fides-modal-overlay" />
      )}

      {showBanner
        ? renderBanner({
            isOpen: bannerIsOpen,
            isEmbedded: options.fidesEmbed,
            onClose: () => {
              setBannerIsOpen(false);
            },
            onSave: () => {
              setBannerIsOpen(false);
            },
            onManagePreferencesClick: handleManagePreferencesClick,
          })
        : null}
      {options.fidesEmbed ? (
        bannerIsOpen ? null : (
          <ConsentContent
            titleProps={attributes.title}
            i18n={i18n}
            renderModalFooter={() =>
              renderModalFooter({
                onClose: handleCloseModalAfterSave,
                isMobile: false,
              })
            }
          >
            {renderModalContent()}
          </ConsentContent>
        )
      ) : (
        <ConsentModal
          attributes={attributes}
          dismissable={experience.experience_config.dismissable}
          i18n={i18n}
          onVendorPageClick={onVendorPageClick}
          renderModalFooter={() =>
            renderModalFooter({
              onClose: handleCloseModalAfterSave,
              isMobile: false,
            })
          }
        >
          {renderModalContent()}
        </ConsentModal>
      )}
    </div>
  );
};

export default Overlay;
