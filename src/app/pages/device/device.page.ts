import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageDevice } from '../../model/storage-device';
import { DeviceService } from '../../services/device.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import {
  TOPIC_DATA,
  TOPIC_SEPARATOR,
  PAYLOAD_VALUE_DATA,
  PAYLOAD_VALUE_MEDIAN,
  PAYLOAD_VALUE_MEAN,
  PAYLOAD_VALUE_EXP_SMOOTH
} from '../../definitions';
import { getMqttValue } from '../../helpers/mqtt.helper';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss']
})
export class DevicePage implements OnInit, OnDestroy {
  currentDevice: StorageDevice;
  success;
  error;

  data: number;
  median: number;
  mean: number;
  expSmooth: number;

  destroy$ = new Subject();

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private device: DeviceService,
    private mqtt: MqttService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    const mqtt = this.mqtt;

    const device = this.device;
    device.currentDevice$.pipe(takeUntil(this.destroy$)).subscribe(d => {
      this.currentDevice = d;
      // mqtt.disconnect(true);
      const mqttOptions = d.mqttOptions;
      if (mqttOptions) {
        mqtt.connect(mqttOptions);
        this.observeTopic(TOPIC_DATA, m => {
          const value = getMqttValue(m);
          this.data = value && value[PAYLOAD_VALUE_DATA];
          this.median = value && value[PAYLOAD_VALUE_MEDIAN];
          this.mean = value && value[PAYLOAD_VALUE_MEAN];
          this.expSmooth = value && value[PAYLOAD_VALUE_EXP_SMOOTH];
        });
      }
    });
  }

  ngOnDestroy() {
    this.mqtt.disconnect(true);
    this.destroy$.next();
  }

  removeDevice() {
    this.removeDeviceAsync()
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(err => {
        this.error = { message: err };
      });
  }

  async removeDeviceAsync(): Promise<any> {
    const currentDevice = this.currentDevice;
    const loader = await this.loadingCtrl.create({
      message: `Removing Device ${currentDevice.id}....`
    });
    loader.present();
    let res: Promise<void>;
    try {
      await this.device.removeDevice(currentDevice);
      res = Promise.resolve();
    } catch (err) {
      res = Promise.reject(err);
    }
    loader.dismiss();
    return res;
  }

  private observeTopic(topic: string, h: (m: IMqttMessage) => void): void {
    this.mqtt
      .observe(`${this.currentDevice.id}${TOPIC_SEPARATOR}${topic}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe(h);
  }
}
