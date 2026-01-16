import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Basic form schema
const basicFormSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type BasicFormValues = z.infer<typeof basicFormSchema>;

function BasicFormDemo(): ReactElement {
  const form = useForm<BasicFormValues>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  function onSubmit(values: BasicFormValues): void {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[350px] space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }): ReactElement => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }): ReactElement => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormDescription>
                We&apos;ll never share your email with anyone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

// Form with select
const selectFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
});

type SelectFormValues = z.infer<typeof selectFormSchema>;

function FormWithSelectDemo(): ReactElement {
  const form = useForm<SelectFormValues>({
    resolver: zodResolver(selectFormSchema),
    defaultValues: {
      email: "",
      role: "",
    },
  });

  function onSubmit(values: SelectFormValues): void {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[350px] space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }): ReactElement => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }): ReactElement => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the user&apos;s access level.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

// Form with checkbox
const checkboxFormSchema = z.object({
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  marketing: z.boolean().default(false),
});

type CheckboxFormValues = z.infer<typeof checkboxFormSchema>;

function FormWithCheckboxDemo(): ReactElement {
  const form = useForm<CheckboxFormValues>({
    resolver: zodResolver(checkboxFormSchema),
    defaultValues: {
      terms: false,
      marketing: false,
    },
  });

  function onSubmit(values: CheckboxFormValues): void {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[350px] space-y-6">
        <FormField
          control={form.control}
          name="terms"
          render={({ field }): ReactElement => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accept terms and conditions</FormLabel>
                <FormDescription>
                  You agree to our Terms of Service and Privacy Policy.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="marketing"
          render={({ field }): ReactElement => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Marketing emails</FormLabel>
                <FormDescription>
                  Receive emails about new products and features.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

// Pre-filled form with validation errors shown
const errorFormSchema = z.object({
  username: z.string().min(5, "Username must be at least 5 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type ErrorFormValues = z.infer<typeof errorFormSchema>;

function FormWithErrorsDemo(): ReactElement {
  const form = useForm<ErrorFormValues>({
    resolver: zodResolver(errorFormSchema),
    defaultValues: {
      username: "ab",
      email: "invalid-email",
    },
    mode: "all",
  });

  function onSubmit(values: ErrorFormValues): void {
    console.log(values);
  }

  function onError(errors: typeof form.formState.errors): void {
    console.log("Validation Errors:", errors);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="w-[350px] space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }): ReactElement => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription>
                Must be at least 5 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }): ReactElement => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

const meta = {
  title: "Components/Form",
  component: BasicFormDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof BasicFormDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicForm: Story = {
  args: {},
};

export const WithSelect: Story = {
  render: (): ReactElement => <FormWithSelectDemo />,
};

export const WithCheckbox: Story = {
  render: (): ReactElement => <FormWithCheckboxDemo />,
};

export const WithValidationErrors: Story = {
  render: (): ReactElement => <FormWithErrorsDemo />,
};
