export const STEPS = [
  {
    number: 1,
    name: "Organization setup",
  },
  {
    number: 2,
    name: "Scan for Systems",
  },
  {
    number: 3,
    name: "Authenticate scanner",
  },
  {
    number: 4,
    name: "Scan results",
  },
  {
    number: 5,
    name: "Describe systems",
  },
  {
    number: 6,
    name: "View your data map",
  },
];

export const REVIEW_STEPS = 5;

export const HORIZONTAL_STEPS = [
  {
    number: 1,
    name: "Describe",
  },
  {
    number: 2,
    name: "Declare",
  },
  {
    number: 3,
    name: "Review",
  },
];

export const iconButtonSize = 107;

// When more links like these are introduced we should move them to a single file.
export const DOCS_URL_AWS_PERMISSIONS =
  "https://ethyca.github.io/fides/guides/generate_resources/#required-permissions";
export const DOCS_URL_IAM_POLICY =
  "https://ethyca.github.io/fides/guides/generate_resources/#sample-iam-policy";
export const DOCS_URL_ISSUES = "https://github.com/ethyca/fides/issues";

// Source: https://docs.aws.amazon.com/general/latest/gr/rande.html
export const AWS_REGION_OPTIONS = [
  { label: "US East (Ohio)", value: "us-east-2" },
  { label: "US East (N. Virginia)", value: "us-east-1" },
  { label: "US West (N. California)", value: "us-west-1" },
  { label: "US West (Oregon)", value: "us-west-2" },
  { label: "Africa (Cape Town)", value: "af-south-1" },
  { label: "Asia Pacific (Hong Kong)", value: "ap-east-1" },
  { label: "Asia Pacific (Jakarta)", value: "ap-southeast-3" },
  { label: "Asia Pacific (Mumbai)", value: "ap-south-1" },
  { label: "Asia Pacific (Osaka)", value: "ap-northeast-3" },
  { label: "Asia Pacific (Seoul)", value: "ap-northeast-2" },
  { label: "Asia Pacific (Singapore)", value: "ap-southeast-1" },
  { label: "Asia Pacific (Sydney)", value: "ap-southeast-2" },
  { label: "Asia Pacific (Tokyo)", value: "ap-northeast-1" },
  { label: "Canada (Central)", value: "ca-central-1" },
  { label: "China (Beijing)", value: "cn-north-1" },
  { label: "China (Ningxia)", value: "cn-northwest-1" },
  { label: "Europe (Frankfurt)", value: "eu-central-1" },
  { label: "Europe (Ireland)", value: "eu-west-1" },
  { label: "Europe (London)", value: "eu-west-2" },
  { label: "Europe (Milan)", value: "eu-south-1" },
  { label: "Europe (Paris)", value: "eu-west-3" },
  { label: "Europe (Stockholm)", value: "eu-north-1" },
  { label: "Middle East (Bahrain)", value: "me-south-1" },
  { label: "South America (São Paulo)", value: "sa-east-1" },
];
