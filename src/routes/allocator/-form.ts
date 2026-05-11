import { createFormHook } from "@tanstack/react-form";

import { Select, Slider, SubscribeButton } from "./-form-components";
import { fieldContext, formContext } from "./-form-context";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    Select,
    Slider,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
