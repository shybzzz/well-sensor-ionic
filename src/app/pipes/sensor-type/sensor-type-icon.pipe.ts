import { Pipe, PipeTransform } from '@angular/core';
import { SensorType } from '../../definitions';

@Pipe({
  name: 'sensorTypeIcon'
})
export class SensorTypeIconPipe implements PipeTransform {
  transform(sensorType: SensorType): any {
    let res: string;
    switch (sensorType) {
      case SensorType.SENSOR_ANALOG_TEST:
        res = 'potentiometer';
        break;
      case SensorType.SENSOR_DS18B20:
        res = 'temperature';
        break;
      case SensorType.SENSOR_GUT800:
        res = 'depth';
        break;
      case SensorType.SENSOR_INA250A2PW:
        res = 'solar';
        break;
      default:
        res = 'simulated';
    }
    return res;
  }
}
