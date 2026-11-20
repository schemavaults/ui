import {
  Component,
  useState,
  type ReactElement,
  type ReactNode,
  type ErrorInfo,
} from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Bomb } from "lucide-react";
import { Button } from "@/components/ui/button";
import ErrorPage, { type ErrorPageProps } from "./ErrorPage";

// -- Error Boundary used by the WithErrorBoundary story --

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class StoryErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, info);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <ErrorPage
          error={this.state.error}
          reset={() => this.setState({ error: null })}
        />
      );
    }
    return this.props.children;
  }
}

// -- Component that throws on demand --

function ThrowOnClick(): ReactElement {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("Something went wrong!");
  }

  return (
    <div className="w-full grow flex flex-col justify-center items-center min-h-screen gap-4">
      <p className="text-md">Everything is fine… for now.</p>
      <Button
        variant="destructive"
        onClick={() => setShouldThrow(true)}
        className="flex flex-row gap-2"
      >
        <Bomb className="h-6 w-6" /> Break things!
      </Button>
    </div>
  );
}

// -- Stories --

const meta = {
  title: "Feedback/Error Page",
  component: ErrorPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    error: {
      table: {
        type: {
          summary: "Error | number | string",
        },
      },
    },
    reset: {
      table: {
        type: {
          summary: "(() => void) | undefined",
        },
      },
      description:
        "Optional callback to reset the error state. When provided, a 'Try Again' button is rendered.",
    },
    message: {
      control: "text",
      table: {
        type: {
          summary: "string | undefined",
        },
      },
      description:
        "Pass an additional message (for when 'error' is a string/number error code rather than a detailed 'Error' instance.",
    },
    resetButtonLabel: {
      control: "text",
      table: {
        type: {
          summary: "string | undefined",
        },
      },
      description:
        "Customize the label of the reset button (defaults to 'Try Again').",
    },
    additionalButtons: {
      table: {
        type: {
          summary: "ReactNode[] | undefined",
        },
      },
      description: "Additional buttons rendered next to the reset button.",
    },
    wordmarkProps: {
      table: {
        type: {
          summary: "WordmarkProps | undefined",
        },
      },
      description:
        "Props forwarded to the <Wordmark /> in the page heading, e.g. to customize the wordmark text and gradient theming.",
    },
    logo: {
      control: false,
      table: {
        type: {
          summary: "ReactNode | undefined",
        },
      },
      description:
        "Optional logo rendered just before the <Wordmark /> in the page heading, e.g. an `<img />` or an inline SVG component. It sits inside the `<h1>`, so give an `<img />` an empty `alt` when the wordmark already names the brand.",
    },
  },
  args: {} satisfies Partial<ErrorPageProps>,
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FromErrorObject: Story = {
  args: {
    error: new Error("This error is from a JavaScript 'Error' instance!"),
  },
};

export const FromStatusCode: Story = {
  args: {
    error: 500,
    message: "Internal Server Error",
  },
};

export const FromErrorCode: Story = {
  args: {
    error: "NOT_FOUND",
    message: "Resource was not found!",
  },
};

export const LongErrorMessage: Story = {
  args: {
    error: "SERVER_MISCONFIGURATION",
    message:
      "The server does not appear to be configured properly. If you are the site admin, please see the logs for more details on the root cause of this error!",
  },
};

export const WithErrorBoundary: StoryObj = {
  render: () => (
    <StoryErrorBoundary>
      <ThrowOnClick />
    </StoryErrorBoundary>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Click "Break things" to trigger an error. The error boundary catches it and renders ErrorPage with a reset button. Clicking "Try Again" resets the boundary.',
      },
    },
  },
};

export const WithCustomResetLabel: Story = {
  args: {
    error: new Error("Failed to load resource."),
    reset: () => {},
    resetButtonLabel: "Retry",
  },
};

export const WithCustomWordmark: Story = {
  args: {
    error: 503,
    message: "Service Unavailable",
    wordmarkProps: {
      wordmarkText: "AcmeCorp",
      gradientColors: ["#16a34a", "#2563eb"],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `wordmarkProps` to customize the wordmark rendered in the page heading — for example a different wordmark text and gradient colors.",
      },
    },
  },
};

export const WithLogo: Story = {
  args: {
    error: 404,
    message: "Page not found",
    reset: () => {},
    logo: (
      <img
        src="/media/icon.png"
        // Decorative: the wordmark beside it already names the brand.
        alt=""
        width={32}
        height={32}
        className="h-8 w-8"
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass a `logo` to render it next to the wordmark in the page heading — here the SchemaVaults logo. Any `ReactNode` works, such as an `<img />` or an inline SVG component.",
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("the logo renders inside the page heading", async () => {
      const heading = canvas.getByRole("heading", { level: 1 });
      // `getByRole("img")` skips decorative (`alt=""`) images, so query the
      // element directly.
      const logo = heading.querySelector("img");
      await expect(logo).not.toBeNull();
      await expect(logo).toHaveAttribute("src", "/media/icon.png");
      await expect(logo).toBeVisible();
    });
    await step("the decorative logo stays out of the heading's name", async () => {
      await expect(
        canvas.getByRole("heading", { level: 1, name: "SchemaVaults Error" }),
      ).toBeInTheDocument();
    });
  },
};

export const WithAdditionalButtons: Story = {
  args: {
    error: 404,
    message: "Page not found",
    reset: () => {},
    additionalButtons: [
      <Button key="home" variant="outline">
        Go Home
      </Button>,
      <Button key="support" variant="ghost">
        Contact Support
      </Button>,
    ],
  },
};
