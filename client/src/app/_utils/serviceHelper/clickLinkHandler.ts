import { View } from "src/app/_models/base/types";
import { FormUse } from "src/app/_models/forms/formTypes";
import { SiteSection } from "src/app/_models/sections/sectionTypes";

export type ClickLinkHandler<T> = (
  item: T | null,
  key: string | null,
  use: FormUse,
  view: View,
  siteSection?: SiteSection
) => void;
