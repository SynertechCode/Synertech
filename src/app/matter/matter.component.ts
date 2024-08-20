import { Component, AfterViewInit, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { Bodies, Engine, Render, World, Mouse, MouseConstraint, Runner } from 'matter-js';

@Component({
  selector: 'app-matter',
  templateUrl: './matter.component.html',
  styleUrls: ['./matter.component.scss']
})
export class MatterComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    const engine = Engine.create();
    const runner = Runner.create();

    const matterCanvas = document.querySelector('#matterCanvas') as HTMLCanvasElement;
    const matterCanvasContainer = document.querySelector('#matterCanvasContainer') as HTMLElement;

    if (matterCanvas && matterCanvasContainer) {
      const width = matterCanvas.clientWidth;
      const height = matterCanvas.clientHeight;

      const render = Render.create({
        element: matterCanvasContainer,
        engine: engine,
        canvas: matterCanvas,
        options: {
          width: width,
          height: height,
          wireframes: false,
          background: '#D4D0C2',
        }
      });

      const ground = Bodies.rectangle(width / 2, height - 20, width, 0, { isStatic: true });
      World.add(engine.world, ground);

      const elements = [
        { id: 'body1', x: 150, y: 100, width: 300, height: 70, text: 'web design' },
        { id: 'body2', x: 450, y: 100, width: 300, height: 70, text: 'creativity' },
        { id: 'body1', x: 750, y: 100, width: 300, height: 70, text: 'experience' },
        { id: 'body2', x: 150, y: 200, width: 300, height: 70, text: 'mobile app' },
        { id: 'body1', x: 450, y: 200, width: 300, height: 70, text: 'smm' },
        { id: 'body2', x: 750, y: 200, width: 300, height: 70, text: 'brands' },
        { id: 'body1', x: 150, y: 300, width: 300, height: 70, text: 'front-end' },
        { id: 'body2', x: 450, y: 300, width: 300, height: 70, text: 'animation' },
        { id: 'body1', x: 750, y: 300, width: 300, height: 70, text: 'figma' },
      ];

      elements.forEach(element => {
        const body = Bodies.rectangle(element.x, element.y, element.width, element.height, {
          render: {
            fillStyle: element.id === 'body1' ? '#fbff36' : '#000',
            strokeStyle: '#000',
            lineWidth: 1
          }
        });
        World.add(engine.world, body);
      });

      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });

      World.add(engine.world, mouseConstraint);

      World.add(engine.world, [
        Bodies.rectangle(width / 2, height + 30, width, 60, { isStatic: true }),
        Bodies.rectangle(width / 2, -30, width, 60, { isStatic: true }),
        Bodies.rectangle(-30, height / 2, 60, height, { isStatic: true }),
        Bodies.rectangle(width + 30, height / 2, 60, height, { isStatic: true })
      ]);

      Runner.run(runner, engine);
      Render.run(render);

      // Функція для малювання тексту
      function drawText() {
        const context = matterCanvas.getContext('2d');
        if (context) {
          elements.forEach(element => {
            context.font = '20px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = element.id === 'body1' ? '#000' : '#fff';
            context.fillText(element.text, element.x, element.y);
          });
        }
      }

      // Оновлюємо canvas після кожного кадру
      (render as any).afterRender(() => {
        drawText();
      });
    } else {
      console.error("Canvas element not found or is not an HTMLCanvasElement");
    }
  }
}
