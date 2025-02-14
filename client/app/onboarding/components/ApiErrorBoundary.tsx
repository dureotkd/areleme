'use client';

import React, { ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  isError: boolean;
  errorMessage: string;
};

class ApiErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { isError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Error detected:', error);
    return { isError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by ErrorBoundary:', error);
  }

  handleCloseModal = () => {
    this.setState((prevState) => ({
      isError: false,
      errorMessage: '',
    }));
  };

  render() {
    if (this.state.isError) {
      return (
        <div className="flex flex-col items-center justify-center bg-primary p-md rounded-sm mt-md">
          <h4 className="text-lg text-white">잠시후 다시 시도해주세요 </h4>
          <p className="text-tiny text-silver">요청 사항을 처리하는데</p>
          <p className="text-tiny text-silver">실패하였습니다</p>
          <button
            className="w-full max-w-[250px] mt-sm pl-xl pr-xl pt-sm pb-sm bg-silver100"
            type="button"
            onClick={() => {
              this.setState({
                isError: false,
                errorMessage: '',
              });
            }}
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;
