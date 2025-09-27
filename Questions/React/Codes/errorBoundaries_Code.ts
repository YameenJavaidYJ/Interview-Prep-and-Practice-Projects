// Error Boundaries in React - Code Examples
// This file contains all the code examples from errorBoundaries.txt

import React, {useState, useEffect} from "react";
import {ErrorBoundary} from "react-error-boundary";

// ============================================================================
// 1. Traditional Class Component Error Boundary
// ============================================================================

class ErrorBoundary extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {hasError: false, error: null};
    }

    static getDerivedStateFromError(error: Error) {
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to monitoring service
        console.error("Error caught by boundary:", error, errorInfo);

        // Send to error reporting service (Sentry, LogRocket, etc.)
        this.logErrorToService(error, errorInfo);
    }

    logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
        // Integration with modern error tracking
        if ((window as any).Sentry) {
            (window as any).Sentry.captureException(error, {
                contexts: {react: errorInfo}
            });
        }
    };

    render() {
        if ((this.state as any).hasError) {
            return (
                <div className="error-fallback">
                    <h2>Something went wrong</h2>
                    <button onClick={() => this.setState({hasError: false})}>Try again</button>
                </div>
            );
        }
        return this.props.children;
    }
}

// ============================================================================
// 2. Modern Libraries & Solutions - React Error Boundary
// ============================================================================

function ErrorFallback({error, resetErrorBoundary}: {error: Error; resetErrorBoundary: () => void}) {
    return (
        <div role="alert">
            <h2>Something went wrong:</h2>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
}

// Usage Example
function ErrorBoundaryUsage() {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, errorInfo) => {
                // Log to service
                console.error("Error caught:", error, errorInfo);
            }}
            onReset={() => {
                // Reset app state
                console.log("Error boundary reset");
            }}>
            <MyComponent />
        </ErrorBoundary>
    );
}

// ============================================================================
// 3. Multiple Error Boundary Levels
// ============================================================================

function MultipleErrorBoundaries() {
    return (
        <ErrorBoundary>
            <Header />
            <ErrorBoundary>
                <MainContent />
            </ErrorBoundary>
            <ErrorBoundary>
                <Sidebar />
            </ErrorBoundary>
        </ErrorBoundary>
    );
}

// ============================================================================
// 4. Error Boundary with Retry Strategy
// ============================================================================

const ErrorBoundaryWithRetry = ({children}: {children: React.ReactNode}) => {
    const [retryCount, setRetryCount] = useState(0);

    const handleRetry = () => {
        setRetryCount((prev) => prev + 1);
    };

    return (
        <ErrorBoundary
            key={retryCount} // Forces remount on retry
            onError={(error) => {
                // Log error
                console.error("Error with retry:", error);
                // Maybe trigger analytics event
            }}
            FallbackComponent={({error, resetErrorBoundary}) => (
                <ErrorFallback
                    error={error}
                    onRetry={() => {
                        handleRetry();
                        resetErrorBoundary();
                    }}
                />
            )}>
            {children}
        </ErrorBoundary>
    );
};

// ============================================================================
// 5. Context-Aware Error Boundary
// ============================================================================

interface ContextAwareErrorBoundaryProps {
    user?: any;
    children: React.ReactNode;
}

class ContextAwareErrorBoundary extends React.Component<ContextAwareErrorBoundaryProps> {
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Include user context, route info, etc.
        const errorContext = {
            user: this.props.user,
            route: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ...errorInfo
        };

        // Send to monitoring service with rich context
        this.reportError(error, errorContext);
    }

    reportError = (error: Error, context: any) => {
        console.error("Context-aware error:", error, context);
        // Send to monitoring service
    };
}

// ============================================================================
// 6. Graceful Degradation Error Boundary
// ============================================================================

interface FeatureErrorBoundaryProps {
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

const FeatureErrorBoundary = ({fallback, children}: FeatureErrorBoundaryProps) => (
    <ErrorBoundary
        FallbackComponent={() => fallback || <div>Feature unavailable</div>}
        onError={() => {
            // Track feature failure
            console.log("Feature error tracked");
            // analytics.track('feature_error', { feature: 'payment' });
        }}>
        {children}
    </ErrorBoundary>
);

// ============================================================================
// 7. What Error Boundaries DON'T Catch - Examples
// ============================================================================

function MyComponent() {
    const handleClick = () => {
        throw new Error("Event handler error"); // Not caught by Error Boundary
    };

    useEffect(() => {
        setTimeout(() => {
            throw new Error("Async error"); // Not caught by Error Boundary
        }, 1000);
    }, []);

    return <button onClick={handleClick}>Click me</button>;
}

// ============================================================================
// 8. React 19+ and Suspense Integration
// ============================================================================

function SuspenseWithErrorBoundary() {
    return (
        <ErrorBoundary>
            <React.Suspense fallback={<div>Loading...</div>}>
                <LazyComponent />
            </React.Suspense>
        </ErrorBoundary>
    );
}

// ============================================================================
// 9. Placeholder Components for Examples
// ============================================================================

function Header() {
    return <header>Header Component</header>;
}

function MainContent() {
    return <main>Main Content</main>;
}

function Sidebar() {
    return <aside>Sidebar</aside>;
}

function MyComponent() {
    return <div>My Component</div>;
}

function LazyComponent() {
    return <div>Lazy Component</div>;
}

// ============================================================================
// 10. Export all components for use
// ============================================================================

export {
    ErrorBoundary,
    ErrorFallback,
    ErrorBoundaryUsage,
    MultipleErrorBoundaries,
    ErrorBoundaryWithRetry,
    ContextAwareErrorBoundary,
    FeatureErrorBoundary,
    MyComponent,
    SuspenseWithErrorBoundary,
    Header,
    MainContent,
    Sidebar,
    LazyComponent
};
