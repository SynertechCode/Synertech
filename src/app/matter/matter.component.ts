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
    const runner = Runner.create(); // Створюємо Runner

    const matterCanvas = document.querySelector('#matterCanvas') as HTMLCanvasElement;

    if (matterCanvas) {
      // Встановлюємо колір фону через JavaScript
      const context = matterCanvas.getContext('2d');
      if (context) {
        context.fillStyle = '#D4D0C2'; // Ваш колір фону
        context.fillRect(0, 0, matterCanvas.width, matterCanvas.height);
      }

      const width = matterCanvas.clientWidth;
      const height = matterCanvas.clientHeight;

      const render = Render.create({
        element: document.querySelector('#matterCanvasContainer') as HTMLElement,
        engine: engine,
        canvas: matterCanvas, // Вказуємо сам canvas для рендеру
        options: {
          width: width,
          height: height,
          wireframes: false, // Вимикаємо каркасний режим для відображення повністю заповнених тіл
          background: '#D4D0C2', // Встановлюємо колір фону
        }
      });

      // Додаємо кілька статичних та динамічних тіл
      const ground = Bodies.rectangle(width / 2, height - 20, width, 0, { isStatic: true });
      World.add(engine.world, ground);

      const elements = [
        { id: 'body1', x: 150, y: 100, width: 300, height: 70, },
        { id: 'body2', x: 450, y: 100, width: 300, height: 70, },
        { id: 'body1', x: 750, y: 100, width: 300, height: 70, },
        { id: 'body2', x: 150, y: 200, width: 300, height: 70, },
        { id: 'body1', x: 450, y: 200, width: 300, height: 70, },
        { id: 'body2', x: 750, y: 200, width: 300, height: 70, },
        { id: 'body1', x: 150, y: 300, width: 300, height: 70, },
        { id: 'body2', x: 450, y: 300, width: 300, height: 70, },
        { id: 'body1', x: 750, y: 300, width: 300, height: 70, },
      ];

      elements.forEach(element => {
        const borderThickness = 50;

        // Створення основного тіла
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

      // Додаємо обмеження меж для кожного тіла
      World.add(engine.world, [
        Bodies.rectangle(width / 2, height + 30, width, 60, { isStatic: true }), // Нижня межа
        Bodies.rectangle(width / 2, -30, width, 60, { isStatic: true }), // Верхня межа
        Bodies.rectangle(-30, height / 2, 60, height, { isStatic: true }), // Ліва межа
        Bodies.rectangle(width + 30, height / 2, 60, height, { isStatic: true }) // Права межа
      ]);

      // Запускаємо рушій за допомогою Runner
      Runner.run(runner, engine);
      Render.run(render);
    } else {
      console.error("Canvas element not found or is not an HTMLCanvasElement");
    }
  }
}
