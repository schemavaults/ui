import {
  Component,
  useState,
  type ReactElement,
  type ReactNode,
  type ErrorInfo,
} from "react";
import type { Meta, StoryObj } from "@storybook/react";
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
  title: "Components/Error Page",
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
