import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import {Router} from "@angular/router";
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/startWith";

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database'



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('doughnutCanvas') doughnutCanvas;
  chart = [];
  canvas: any;
  ctx: any;
  breakpoint: any;

  @ViewChild('barChart') barCanvas;
  @ViewChild('otBreakdown') otCanvas;
  @ViewChild('escapeBreakdown') escapeCanvas;
  @ViewChild('ngBreakdown') ngCanvas;
  lineChart: any;
  otChart: any;
  ngChart: any;
  escapeChart: any;

  hourText: String='';
  minuteText: String='';
  secondText: String='';

  public cols: Observable<number>;

  public loading = false;
  awardInfo = {};

  //itemRef: Observable<any>;
  itemRef: AngularFireObject<any>;




  constructor(private router: Router, private fireAuth: AngularFireAuth, private fireData: AngularFireDatabase, private observableMedia: ObservableMedia) {
    console.log('here home')
    this.loading = true;
    this.setUp();
   }

   logOut() {
     this.fireAuth.auth.signOut();
     this.router.navigate(['']);
   }

   setUp() {
     const unsubscribe = this.fireAuth.auth.onAuthStateChanged(user => {
       //this.loading = false;
       if (!user) {
         console.log('no user')
         this.loading = false;
         //this.stopLoad();
         console.log(this.loading)
         this.router.navigate(['']);
         //unsubscribe();
       } else {
       console.log('hmm')
       //this.loading = false;

         //unsubscribe();
       }

     });

     console.log('ngoninit home')

     this.itemRef = this.fireData.object(`/dashboard`);
     // this.profileData = this.itemRef.valueChanges();
     //
     this.itemRef.snapshotChanges().subscribe(action => {
       let chartData = action.payload.val();
       this.makeCharts(chartData);
       this.secondsToHms(chartData['driveInfo']['totalTime']);
       this.loading = false;

     });


     let totalTime = 0;
     let large = 0;
     //let this.awardInfo = {};
     this.awardInfo['OT Tavern'] = 0;
     this.awardInfo['VR Wireless'] = 0;
     this.awardInfo['Escape Room'] = 0;
     this.awardInfo['False'] = {}
     this.awardInfo['False']['OT Tavern'] = 0;
     this.awardInfo['False']['VR Wireless'] = 0;
     this.awardInfo['False']['Escape Room'] = 0;
     this.awardInfo['True'] = {}
     this.awardInfo['True']['OT Tavern'] = 0;
     this.awardInfo['True']['VR Wireless'] = 0;
     this.awardInfo['True']['Esacpe Room'] = 0;

     // let test = this.fireData.list(`profile/`).snapshotChanges().subscribe(action => {
     //   totalTime = 0;
     //   console.log('ahh')
     //   console.log(action)
     //   for(let item of action) {
     //     console.log('VAL')
     //     console.log(item.payload.val().drives)
     //     for (let info in item.payload.val().drives) {
     //         console.log('adding')
     //         console.log(info)
     //         totalTime += item.payload.val().drives[info]['time']
     //         if(item.payload.val().drives[info]['time'] > large) {
     //           large = item.payload.val().drives[info]['time'];
     //         }
     //     }
     //
     //     for (let info in item.payload.val().awards) {
     //         this.awardInfo[item.payload.val().awards[info]['company']] += 1;
     //         if(item.payload.val().awards[info]['redeemed'] == false) {
     //             this.awardInfo['False'][item.payload.val().awards[info]['company']] += 1;
     //         } else if(item.payload.val().awards[info]['redeemed'] == true) {
     //           this.awardInfo['True'][item.payload.val().awards[info]['company']] += 1;
     //         }
     //     }
     //
     //   }
     //   //console.log(action['payload'].val())
     //   console.log('DAMNN')
     //   console.log(totalTime)
     //   console.log(large)
     //   console.log(this.awardInfo)
     //   //console.log(this.secondsToHms(totalTime))
     //   //this.makeCharts();
     //   this.loading = false;
     // });

     //console.log(test)
     const grid = new Map([
    ["xs", 1],
    ["sm", 2],
    ["md", 2],
    ["lg", 2],
    ["xl", 2]
  ]);
  let start: number;
  grid.forEach((cols, mqAlias) => {
    if (this.observableMedia.isActive(mqAlias)) {
      start = cols;
    }
  });
  this.cols = this.observableMedia.asObservable()
    .map(change => {
      console.log(change);
      console.log(grid.get(change.mqAlias));
      return grid.get(change.mqAlias);
    })
    .startWith(start);
   }



  ngOnInit() {}

  secondsToHms(d) {
    d = Number(d);
    h = 0;
    m = 0;
    s = 0;
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    this.hourText = String(h);
    this.minuteText = String(m);
    this.secondText = String(s);
    return hDisplay + mDisplay + sDisplay;
}

  makeCharts(chartData) {
    this.lineChart = new Chart(this.barCanvas.nativeElement, {

            type: 'doughnut',
            data: {
                labels: ["O.T. Tavern", "VR Wireless", "Escape Room"],
                datasets: [{
                    label: 'Data',
                    data: [chartData['rewardInfo']['ot-tavern']['total'],chartData['rewardInfo']['vr-wireless']['total'], chartData['rewardInfo']['escape-room']['total']],
                    backgroundColor: [
                                  '#6bdeef',
                                  '#7c79ce',
                                  '#42f477'
                              ],
                    hoverBackgroundColor: [
                                  '#96e6f2',
                                  '#9491d6',
                                  '#19e857'
                              ]
                }]
            },
            options: {
              title: {
                display: true,
                text: 'User Rewards Breakdown',
                responsive: true,
                fontColor: 'white'
              },
              legend: {
                  labels: {
                      // This more specific font property overrides the global property
                      fontColor: 'white'
                  }
              }
            }

        });

        this.escapeChart = new Chart(this.escapeCanvas.nativeElement, {

                type: 'doughnut',
                data: {
                    labels: ["Redeemed", "Not Redeemed"],
                    datasets: [{
                        label: 'Data',
                        data: [chartData['rewardInfo']['escape-room']['redeemed'],chartData['rewardInfo']['escape-room']['unredeemed']],
                        backgroundColor: [
                                      '#6bdeef',
                                      '#7c79ce'
                                  ],
                        hoverBackgroundColor: [
                                      '#96e6f2',
                                      '#9491d6'
                                  ]
                    }]
                },
                options: {
                  title: {
                    display: true,
                    text: 'Escape Room Breakdown',
                    responsive: true,
                    fontColor: 'white'
                  },
                  legend: {
                      labels: {
                          // This more specific font property overrides the global property
                          fontColor: 'white'
                      }
                  }
                }

            });

        this.otChart = new Chart(this.otCanvas.nativeElement, {

                type: 'doughnut',
                data: {
                    labels: ["Redeemed", "Not Redeemed"],
                    datasets: [{
                        label: 'Data',
                        data: [chartData['rewardInfo']['ot-tavern']['redeemed'],chartData['rewardInfo']['ot-tavern']['unredeemed']],
                        backgroundColor: [
                                      '#6bdeef',
                                      '#7c79ce'
                                  ],
                        hoverBackgroundColor: [
                                      '#96e6f2',
                                      '#9491d6'
                                  ]
                    }]
                },
                options: {
                  title: {
                    display: true,
                    text: 'O.T. Tavern Breakdown',
                    responsive: true,
                    fontColor: 'white'
                  },
                  legend: {
                      labels: {
                          // This more specific font property overrides the global property
                          fontColor: 'white'
                      }
                  }
                }

            });

            this.ngChart = new Chart(this.ngCanvas.nativeElement, {

                    type: 'doughnut',
                    data: {
                        labels: ["Redeemed", "Not Redeemed"],
                        datasets: [{
                            label: 'Data',
                            data: [chartData['rewardInfo']['vr-wireless']['redeemed'],chartData['rewardInfo']['vr-wireless']['unredeemed']],
                            backgroundColor: [
                                          '#6bdeef',
                                          '#7c79ce'
                                      ],
                            hoverBackgroundColor: [
                                          '#96e6f2',
                                          '#9491d6'
                                      ]
                        }]
                    },
                    options: {
                      title: {
                        display: true,
                        text: 'VR Wireless Breakdown',
                        responsive: true,
                        fontColor: 'white'
                      },
                      legend: {
                          labels: {
                              // This more specific font property overrides the global property
                              fontColor: 'white'
                          }
                      }
                    }

                });
  }

  // ngAfterViewInit() {
  //   this.lineChart = new Chart(this.barCanvas.nativeElement, {
  //
  //           type: 'doughnut',
  //           data: {
  //               labels: ["O.T. Tavern", "VR Wireless"],
  //               datasets: [{
  //                   label: 'Data',
  //                   data: [13,5],
  //                   backgroundColor: [
  //                                 '#6bdeef',
  //                                 '#7c79ce'
  //                             ],
  //                   hoverBackgroundColor: [
  //                                 '#96e6f2',
  //                                 '#9491d6'
  //                             ]
  //               }]
  //           },
  //           options: {
  //             title: {
  //               display: true,
  //               text: 'User Rewards Breakdown',
  //               responsive: true,
  //               fontColor: 'white'
  //             },
  //             legend: {
  //                 labels: {
  //                     // This more specific font property overrides the global property
  //                     fontColor: 'white'
  //                 }
  //             }
  //           }
  //
  //       });
  //
  //       this.otChart = new Chart(this.otCanvas.nativeElement, {
  //
  //               type: 'doughnut',
  //               data: {
  //                   labels: ["Redeemed", "Not Redeemed"],
  //                   datasets: [{
  //                       label: 'Data',
  //                       data: [13,5],
  //                       backgroundColor: [
  //                                     '#6bdeef',
  //                                     '#7c79ce'
  //                                 ],
  //                       hoverBackgroundColor: [
  //                                     '#96e6f2',
  //                                     '#9491d6'
  //                                 ]
  //                   }]
  //               },
  //               options: {
  //                 title: {
  //                   display: true,
  //                   text: 'O.T. Tavern Breakdown',
  //                   responsive: true,
  //                   fontColor: 'white'
  //                 },
  //                 legend: {
  //                     labels: {
  //                         // This more specific font property overrides the global property
  //                         fontColor: 'white'
  //                     }
  //                 }
  //               }
  //
  //           });
  //
  //           this.ngChart = new Chart(this.ngCanvas.nativeElement, {
  //
  //                   type: 'doughnut',
  //                   data: {
  //                       labels: ["Redeemed", "Not Redeemed"],
  //                       datasets: [{
  //                           label: 'Data',
  //                           data: [13,5],
  //                           backgroundColor: [
  //                                         '#6bdeef',
  //                                         '#7c79ce'
  //                                     ],
  //                           hoverBackgroundColor: [
  //                                         '#96e6f2',
  //                                         '#9491d6'
  //                                     ]
  //                       }]
  //                   },
  //                   options: {
  //                     title: {
  //                       display: true,
  //                       text: 'VR Wireless Breakdown',
  //                       responsive: true,
  //                       fontColor: 'white'
  //                     },
  //                     legend: {
  //                         labels: {
  //                             // This more specific font property overrides the global property
  //                             fontColor: 'white'
  //                         }
  //                     }
  //                   }
  //
  //               });
  //
  // }
}
