import { createFormHook } from "@tanstack/react-form";

import { Select, Slider, SubscribeButton } from "../components/allocator.FormComponents";
import { fieldContext, formContext } from "./allocator.form-context";

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
