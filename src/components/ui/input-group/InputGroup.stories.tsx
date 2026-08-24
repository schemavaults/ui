import { useState, type ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Search,
  Mail,
  DollarSign,
  Globe,
  Eye,
  EyeOff,
  Copy,
  User,
  Percent,
} from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  inputGroupSizeIds,
  inputGroupVariantIds,
  type InputGroupSize,
  type InputGroupVariant,
} from "./input-group";

interface InputGroupPlaygroundProps {
  variant?: InputGroupVariant;
  size?: InputGroupSize;
  disabled?: boolean;
  invalid?: boolean;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
}

function InputGroupPlayground({
  variant,
  size,
  disabled,
  invalid,
  prefix,
  suffix,
  placeholder,
}: InputGroupPlaygroundProps): ReactElement {
  return (
    <InputGroup
      variant={variant}
      size={size}
      disabled={disabled}
      invalid={invalid}
      className="w-96"
    >
      {prefix ? <InputGroupAddon position="start">{prefix}</InputGroupAddon> : null}
      <InputGroupInput placeholder={placeholder} />
      {suffix ? <InputGroupAddon position="end">{suffix}</InputGroupAddon> : null}
    </InputGroup>
  );
}

const meta = {
  title: "Components/InputGroup",
  component: InputGroupPlayground,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A composable input group that wraps an `<input>` with optional prefix and suffix addons for text, icons, or buttons. Useful for currency (`$` / `USD`), URLs (`https://` / `.com`), search (icon prefix), copy-to-clipboard fields (button suffix), and any input that benefits from inline context.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: inputGroupVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: inputGroupSizeIds,
      control: { type: "radio" },
    },
    disabled: { control: { type: "boolean" } },
    invalid: { control: { type: "boolean" } },
    prefix: { control: { type: "text" } },
    suffix: { control: { type: "text" } },
    placeholder: { control: { type: "text" } },
  },
  args: {
    variant: "default",
    size: "md",
    disabled: false,
    invalid: false,
    prefix: "$",
    suffix: "USD",
    placeholder: "0.00",
  },
} satisfies Meta<typeof InputGroupPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CurrencyInput: Story = {
  render: (): ReactElement => (
    <InputGroup className="w-72">
      <InputGroupAddon position="start">
        <DollarSign />
      </InputGroupAddon>
      <InputGroupInput type="number" placeholder="0.00" step="0.01" />
      <InputGroupAddon position="end">USD</InputGroupAddon>
    </InputGroup>
  ),
};

export const URLInput: Story = {
  render: (): ReactElement => (
    <InputGroup className="w-96">
      <InputGroupAddon position="start">https://</InputGroupAddon>
      <InputGroupInput placeholder="example" />
      <InputGroupAddon position="end">.com</InputGroupAddon>
    </InputGroup>
  ),
};

export const SearchInput: Story = {
  render: (): ReactElement => (
    <InputGroup className="w-96">
      <InputGroupAddon position="start">
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search records…" />
    </InputGroup>
  ),
};

export const UsernameInput: Story = {
  render: (): ReactElement => (
    <InputGroup className="w-72">
      <InputGroupAddon position="start">@</InputGroupAddon>
      <InputGroupInput placeholder="username" />
    </InputGroup>
  ),
};

export const EmailInput: Story = {
  render: (): ReactElement => (
    <InputGroup className="w-96">
      <InputGroupAddon position="start">
        <Mail />
      </InputGroupAddon>
      <InputGroupInput type="email" placeholder="you@example.com" />
    </InputGroup>
  ),
};

export const PercentageInput: Story = {
  render: (): ReactElement => (
    <InputGroup className="w-48">
      <InputGroupInput type="number" placeholder="0" min={0} max={100} />
      <InputGroupAddon position="end">
        <Percent />
      </InputGroupAddon>
    </InputGroup>
  ),
};

function PasswordToggleRenderer(): ReactElement {
  const [visible, setVisible] = useState(false);
  return (
    <InputGroup className="w-96">
      <InputGroupAddon position="start">
        <User />
      </InputGroupAddon>
      <InputGroupInput
        type={visible ? "text" : "password"}
        placeholder="Enter password"
        defaultValue="s3cret-value"
      />
      <InputGroupButton
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={(): void => setVisible((v) => !v)}
      >
        {visible ? <EyeOff /> : <Eye />}
      </InputGroupButton>
    </InputGroup>
  );
}

export const PasswordWithVisibilityToggle: Story = {
  render: (): ReactElement => <PasswordToggleRenderer />,
};

function CopyableRenderer(): ReactElement {
  const [copied, setCopied] = useState(false);
  const value = "svlts_mail_pk_1a2b3c4d5e6f";
  return (
    <InputGroup className="w-[28rem]">
      <InputGroupInput readOnly value={value} />
      <InputGroupButton
        aria-label="Copy value"
        onClick={(): void => {
          void navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
          });
        }}
      >
        <Copy />
        {copied ? "Copied" : "Copy"}
      </InputGroupButton>
    </InputGroup>
  );
}

export const CopyableValue: Story = {
  render: (): ReactElement => <CopyableRenderer />,
};

export const Disabled: Story = {
  render: (): ReactElement => (
    <InputGroup className="w-72" disabled>
      <InputGroupAddon position="start">
        <DollarSign />
      </InputGroupAddon>
      <InputGroupInput placeholder="0.00" defaultValue="42.00" />
      <InputGroupAddon position="end">USD</InputGroupAddon>
    </InputGroup>
  ),
};

export const Invalid: Story = {
  render: (): ReactElement => (
    <div className="flex w-96 flex-col gap-1.5">
      <InputGroup invalid>
        <InputGroupAddon position="start">
          <Globe />
        </InputGroupAddon>
        <InputGroupInput defaultValue="not a url" />
        <InputGroupAddon position="end">.com</InputGroupAddon>
      </InputGroup>
      <p className="text-xs text-destructive">Enter a valid subdomain.</p>
    </div>
  ),
};

function AllSizesRenderer(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {inputGroupSizeIds.map((s) => (
        <InputGroup key={s} size={s} className="w-96">
          <InputGroupAddon position="start">
            <DollarSign />
          </InputGroupAddon>
          <InputGroupInput
            placeholder={`size = ${s}`}
            defaultValue="1,234.00"
          />
          <InputGroupAddon position="end">USD</InputGroupAddon>
        </InputGroup>
      ))}
    </div>
  );
}

export const AllSizes: Story = {
  render: (): ReactElement => <AllSizesRenderer />,
};

function AllVariantsRenderer(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {inputGroupVariantIds.map((v) => (
        <InputGroup key={v} variant={v} className="w-96">
          <InputGroupAddon position="start">
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder={`variant = ${v}`} />
        </InputGroup>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: (): ReactElement => <AllVariantsRenderer />,
};
