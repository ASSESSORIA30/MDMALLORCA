"use client";
import { Component, type ReactNode } from "react";
export class AssetBoundary extends Component<
  { children: ReactNode; message: string },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div className="empty-state" role="alert">
          <p>{this.props.message}</p>
          <button
            className="arrow-link"
            onClick={() => this.setState({ failed: false })}
          >
            ↻
          </button>
        </div>
      );
    return this.props.children;
  }
}
