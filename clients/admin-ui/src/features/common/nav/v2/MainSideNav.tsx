import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AntButton,
  Box,
  Button,
  Link,
  ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  QuestionIcon,
  Stack,
  Text,
  UnorderedList,
  UserIcon,
  VStack,
} from "fidesui";
import palette from "fidesui/src/palette/palette.module.scss";
import NextLink from "next/link";
import { useRouter } from "next/router";

import logoImage from "~/../public/logo-white.svg";
import { useAppDispatch, useAppSelector } from "~/app/hooks";
import { LOGIN_ROUTE } from "~/constants";
import { logout, selectUser, useLogoutMutation } from "~/features/auth";
import Image from "~/features/common/Image";
import { useGetHealthQuery } from "~/features/plus/plus.slice";

import { useNav } from "./hooks";
import { ActiveNav, NavGroup, NavGroupChild } from "./nav-config";
import { INDEX_ROUTE } from "./routes";

const NAV_BACKGROUND_COLOR = palette.FIDESUI_MINOS;
const NAV_WIDTH = "200px";

const FidesLogoHomeLink = () => (
  <Box px={2}>
    <Link as={NextLink} href={INDEX_ROUTE} display="flex">
      <Image src={logoImage} alt="Fides Logo" width={116} />
    </Link>
  </Box>
);

export const NavSideBarLink = ({
  childGroup,
  isActive,
}: {
  childGroup: NavGroupChild;
  isActive: boolean;
}) => {
  const { title, path } = childGroup;
  return (
    <ListItem listStyleType="none">
      {/* TODO PROD-2563 */}
      <Button
        as={NextLink}
        href={path}
        height="34px"
        variant="ghost"
        fontWeight="normal"
        fontSize="sm"
        px={2}
        width="100%"
        justifyContent="start"
        color={palette.FIDESUI_NEUTRAL_200}
        isActive={isActive}
        _hover={{
          backgroundColor: palette.FIDESUI_NEUTRAL_800,
        }}
        _active={{
          color: palette.FIDESUI_MINOS,
          backgroundColor: palette.FIDESUI_SANDSTONE,
        }}
        _focus={{
          outline: "none",
        }}
        data-testid={`${title}-nav-link`}
      >
        {title}
      </Button>
    </ListItem>
  );
};

const NavGroupMenu = ({
  group,
  active,
}: {
  group: NavGroup;
  active: ActiveNav | undefined;
}) => (
  <AccordionItem border="none" data-testid={`${group.title}-nav-group`}>
    <h3>
      <AccordionButton px={2} py={3}>
        <Box
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          as="span"
          flex="1"
          textAlign="left"
        >
          {group.title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h3>
    <AccordionPanel fontSize="sm" p={0}>
      <UnorderedList m={0}>
        {group.children.map((child) => {
          const isActive = child.exact
            ? active?.path === child.path
            : !!active?.path?.startsWith(child.path);
          return (
            <NavSideBarLink
              isActive={isActive}
              key={child.path}
              childGroup={child}
            />
          );
        })}
      </UnorderedList>
    </AccordionPanel>
  </AccordionItem>
);

/** Inner component which we export for component testing */
export const UnconnectedMainSideNav = ({
  groups,
  active,
  handleLogout,
  username,
}: {
  groups: NavGroup[];
  active: ActiveNav | undefined;
  handleLogout: any;
  username: string;
}) => (
  <Box
    p={4}
    pb={0}
    minWidth={NAV_WIDTH}
    maxWidth={NAV_WIDTH}
    backgroundColor={NAV_BACKGROUND_COLOR}
    height="100%"
    overflow="auto"
  >
    <VStack
      as="nav"
      alignItems="start"
      color="white"
      height="100%"
      justifyContent="space-between"
    >
      <Box>
        <Box pb={6}>
          <FidesLogoHomeLink />
        </Box>
        <Accordion
          allowMultiple
          width="100%"
          defaultIndex={[...Array(groups.length).keys()]}
          overflowY="auto"
        >
          {groups.map((group) => (
            <NavGroupMenu key={group.title} group={group} active={active} />
          ))}
        </Accordion>
      </Box>
      <Box alignItems="center" pb={4}>
        <AntButton
          href="https://docs.ethyca.com"
          className="border-none bg-transparent hover:!bg-gray-700"
          icon={<QuestionIcon color="white" boxSize={4} />}
        />
        {username && (
          <Menu>
            <MenuButton
              as={AntButton}
              className="border-none bg-transparent hover:!bg-gray-700"
              data-testid="header-menu-button"
              icon={<UserIcon color="white" />}
            />
            <MenuList shadow="xl" zIndex="20">
              <Stack px={3} py={2} spacing={1}>
                <Text color="gray.700" fontWeight="medium">
                  {username}
                </Text>
              </Stack>

              <MenuDivider />
              <MenuItem
                color="gray.700"
                _focus={{ color: "complimentary.500", bg: "gray.100" }}
                onClick={handleLogout}
                data-testid="header-menu-sign-out"
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Box>
    </VStack>
  </Box>
);

const MainSideNav = () => {
  const router = useRouter();
  const nav = useNav({ path: router.pathname });
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const plusQuery = useGetHealthQuery();
  const username = user ? user.username : "";

  const handleLogout = async () => {
    await logoutMutation({});
    // Go to Login page first, then dispatch logout so that ProtectedRoute does not
    // tack on a redirect URL. We don't need a redirect URL if we are just logging out!
    router.push(LOGIN_ROUTE).then(() => {
      dispatch(logout());
    });
  };

  // While we are loading if we have plus, the nav isn't ready to display yet
  // since otherwise new items can suddenly pop in. So instead, we render an empty
  // version of the nav during load, so that when the nav does load, it is fully featured.
  if (plusQuery.isLoading) {
    return (
      <Box
        minWidth={NAV_WIDTH}
        maxWidth={NAV_WIDTH}
        backgroundColor={NAV_BACKGROUND_COLOR}
        height="100%"
      />
    );
  }

  return (
    <UnconnectedMainSideNav
      {...nav}
      handleLogout={handleLogout}
      username={username}
    />
  );
};

export default MainSideNav;
