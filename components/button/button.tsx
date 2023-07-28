import * as React from 'react';
import { isNumeric } from '../_util';

interface ButtonType {
  className?: string;
}

console.log(isNumeric);

const Button: React.FC<ButtonType> = ({ className }: ButtonType) => (
  <button className={`ss-button ${className ?? ''}`}>点我</button>
);

Button.defaultProps = {
  className: '',
};

export default Button;
