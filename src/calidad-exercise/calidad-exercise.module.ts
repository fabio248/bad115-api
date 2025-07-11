import { Module } from '@nestjs/common';
import { CalidadExerciseController } from './calidad-exercise.controller';
import { AuthModule } from '../auth/auth.module';
import { CalidadExerciseService } from './calidad-exercise.service';

@Module({
  controllers: [CalidadExerciseController],
  providers: [CalidadExerciseService],
  imports: [AuthModule],
})
export class CalidadExerciseModule {}
