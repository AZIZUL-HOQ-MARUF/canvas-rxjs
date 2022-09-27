import './style.css';

import { fromEvent, skip } from 'rxjs';
import { switchMap, repeat, takeUntil, scan } from 'rxjs/operators';

let canvas: HTMLCanvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement;

let context = canvas.getContext('2d');
let cRect = canvas.getBoundingClientRect();
let offsetX = cRect.left;
let offsetY = cRect.top;

let $mouseDown = fromEvent(canvas, 'mousedown');
let $mouseUp = fromEvent(window, 'mouseup');
let $mouseMove = fromEvent(window, 'mousemove');
$mouseDown
  .pipe(
    switchMap((down) => $mouseMove),
    takeUntil($mouseUp),
    scan((acc, event) => ({ prev: acc.curt, curt: event }), {
      prev: null,
      curt: null,
    }),
    skip(1),
    repeat()
  )
  .subscribe((data) => {
    let prevX = data.prev.clientX - offsetX;
    let prevY = data.prev.clientY - offsetY;
    let curtX = data.curt.clientX - offsetX;
    let curtY = data.curt.clientY - offsetY;

    context.beginPath();
    context.moveTo(prevX, prevY);
    context.lineTo(curtX, curtY);
    context.lineWidth = 5;
    context.stroke();
    context.closePath();
  });

let clearButton = document.getElementById('clear');
let $clearClicked = fromEvent(clearButton, 'click');

$clearClicked.subscribe(() =>
  context.clearRect(0, 0, canvas.width, canvas.height)
);
