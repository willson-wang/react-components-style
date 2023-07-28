import * as React from 'react';

interface ButtonType {
  className?: string;
}

const Button: React.FC<ButtonType> = ({ className }: ButtonType) => (
  <button className={`ss-button ${className ?? ''}`}>点我</button>
);

Button.defaultProps = {
  className: '',
};

export default Button;
