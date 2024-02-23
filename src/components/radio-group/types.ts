import { ReactNode } from "react";

type ListItem = {
    description: string;
    value: string;
    child: string | ReactNode
}

export type RadioGroupType = {
    label: string;
    radioList: ListItem[]
}