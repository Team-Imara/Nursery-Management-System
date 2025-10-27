
import { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <div className="p-8 text-center text-red-600">Something went wrong. Please try again later.</div>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;