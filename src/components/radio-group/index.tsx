"use client";

import { RadioGroup as NextRadioGroup } from "@nextui-org/react";
import { CustomRadio } from "./CustomRadio";
import { RadioGroupType } from "./types";

export const RadioGroup = ({ label, radioList }: RadioGroupType) => {
  return (
    <NextRadioGroup label={label}>
      {radioList.map(({ description, value, child }) => {
        return (
          <CustomRadio description={description} value={value} key={value}>
            {child}
          </CustomRadio>
        );
      })}
    </NextRadioGroup>
  );
};
