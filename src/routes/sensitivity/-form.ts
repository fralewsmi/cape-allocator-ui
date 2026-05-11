import { createFormHook } from "@tanstack/react-form";

import { Slider, SubscribeButton } from "./-form-components";
import { fieldContext, formContext } from "./-form-context";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    Slider,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
