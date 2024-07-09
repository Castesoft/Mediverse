export class PopoverProps {
  title?: string;
  text?: string;
  placement: 'top'|'right'|'auto'|'left'|'bottom' = 'auto';
  triggers: PopoverTriggers = 'mouseenter:mouseleave';

  constructor(text: string) {
    this.text = text;
    this.title = '';
    this.placement = 'auto';
    this.triggers = 'mouseenter:mouseleave';
  }
}

export type PopoverTriggers = 'mouseenter:mouseleave'|'dblclick'|'keypress:focusout'|'focus';
