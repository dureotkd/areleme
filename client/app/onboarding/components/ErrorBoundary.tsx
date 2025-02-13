'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log('zzzzzzzzzz');

    // 다음 렌더링에서 폴백 UI가 보이도록 Error상태 업데이트.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('zzzzzzzzzz');

    // 특정 서비스에 에러를 기록할 수도 있다.
  }

  render() {
    console.log('hello');

    return this.props.children;
  }
}

export default ErrorBoundary;
