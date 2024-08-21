import { Component, AfterViewInit, Inject, HostListener } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { Bodies, Engine, Render, World, Mouse, MouseConstraint, Runner, Events } from 'matter-js';

@Component({
  selector: 'app-matter',
  templateUrl: './matter.component.html',
  styleUrls: ['./matter.component.scss']
})
export class MatterComponent implements AfterViewInit {
  private engine = Engine.create();
  private runner = Runner.create();
  private render!: Render;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (this.render) {
      Render.stop(this.render);
      Runner.stop(this.runner);
      World.clear(this.engine.world, true); // Очищуємо світ, зберігаючи статичні тіла
    }

    const matterCanvas = document.querySelector('#matterCanvas') as HTMLCanvasElement;
    const matterCanvasContainer = document.querySelector('#matterCanvasContainer') as HTMLElement;

    if (matterCanvas && matterCanvasContainer) {
      const width = window.innerWidth; // Отримуємо ширину вікна
      const height = matterCanvas.clientHeight; // Висота канваса залишається такою ж

      this.render = Render.create({
        element: matterCanvasContainer,
        engine: this.engine,
        canvas: matterCanvas,
        options: {
          width: width,
          height: height,
          wireframes: false,
          background: '#D4D0C2',
        }
      });

      const ground = Bodies.rectangle(width / 2, height - 20, width, 0, { isStatic: true });
      World.add(this.engine.world, ground);

      // Визначаємо розміри та chamfer.radius на основі ширини вікна
      let elementWidth: number;
      let elementHeight: number;
      let chamferRadius: number;

      if (width >= 1512 && width <= 1919) {
        elementWidth = 237;
        elementHeight = 60;
        chamferRadius = 36;
      } else if (width >= 834 && width <= 1511) {
        elementWidth = 141;
        elementHeight = 36;
        chamferRadius = 24;
      } else if (width >= 320 && width <= 833) {
        elementWidth = 122;
        elementHeight = 40;
        chamferRadius = 18;
      } else {
        elementWidth = 300; // Розмір за замовчуванням
        elementHeight = 70;
        chamferRadius = 36;
      }

      const numberOfElements = 9; // Кількість елементів для створення
      const elements = Array.from({ length: numberOfElements }, () => {
        const x = Math.random() * (width - elementWidth) + elementWidth / 2;
        const y = Math.random() * (height - elementHeight) + elementHeight / 2;

        return {
          id: Math.random() > 0.5 ? 'body1' : 'body2',
          x: x,
          y: y,
          width: elementWidth,
          height: elementHeight
        };
      });

      const textElements = [
        'WEB DESIGN',
        'CREATIVITY',
        'EXPERIENCE',
        'MOBILE APP',
        'SMM',
        'BRANDS',
        'FRONT-END',
        'ANIMATION',
        'FIGMA',
      ];

      elements.forEach((element, index) => {
        const body = Bodies.rectangle(element.x, element.y, element.width, element.height, {
          chamfer: { radius: chamferRadius }, // Використовуємо адаптований chamfer.radius
          render: {
            fillStyle: element.id === 'body1' ? '#fbff36' : '#000',
            strokeStyle: '#000',
            lineWidth: 1,
          }
        });
        World.add(this.engine.world, body);

        Events.on(this.render, 'afterRender', () => {
          const context = this.render.context;
          context.save(); // Зберігаємо поточний стан контексту

          // Переміщуємо контекст до центру тіла
          context.translate(body.position.x, body.position.y);
          context.rotate(body.angle); // Повертаємо контекст згідно з кутом тіла

          context.font = '20px Arial';
          context.fillStyle = element.id === 'body1' ? '#000' : '#fff';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(
            textElements[index % textElements.length], // Вибираємо текст для кожного елемента
            0, // Тепер центр тексту збігається з центром тіла
            0
          );

          context.restore(); // Відновлюємо попередній стан контексту
        });
      });

      const mouse = Mouse.create(this.render.canvas);
      const mouseConstraint = MouseConstraint.create(this.engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });

      World.add(this.engine.world, mouseConstraint);

      World.add(this.engine.world, [
        Bodies.rectangle(width / 2, height + 30, width, 60, { isStatic: true }),
        Bodies.rectangle(width / 2, -30, width, 60, { isStatic: true }),
        Bodies.rectangle(-30, height / 2, 60, height, { isStatic: true }),
        Bodies.rectangle(width + 30, height / 2, 60, height, { isStatic: true })
      ]);

      Runner.run(this.runner, this.engine);
      Render.run(this.render);

    } else {
      console.error("Canvas element not found or is not an HTMLCanvasElement");
    }
  }
}
