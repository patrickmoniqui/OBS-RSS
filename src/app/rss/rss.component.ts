import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js'
import { NewsRss } from '../model/RssData';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.scss']
})
export class RssComponent implements OnInit {
  RssData: NewsRss = {} as NewsRss;
  RssDataInlineText: string = "";

  SpeedTime = 60;
  Speed = this.SpeedTime + "s"

  RssFeedUrl: string = ""

  RssFeedTake: number = -1
  RssFeedResultUrl: string = ""
  
  @Input()
  Color = 'black'

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: any) => {
      var symbol = params.params.q ?? 'AAPL';
      this.refresh();
    });
  }

  refresh() {
    //this.GetHtml()
  }

  GenerateRssFeedResultUrl(): string {
    this.RssFeedResultUrl = window.location.origin + "/rss/inline-text?";

    var queryParams = new Map();

    if(this.RssFeedUrl) {
      queryParams.set('url', encodeURIComponent(this.RssFeedUrl));
    }

    if(this.SpeedTime) {
      queryParams.set('scrollSpeed', this.SpeedTime);
    }

    if(this.RssFeedTake){
      queryParams.set('nbNews', this.RssFeedTake)
    }

    if(this.Color){
      queryParams.set('color', this.Color)
    }

    queryParams.forEach( (value, key) => {
      this.RssFeedResultUrl += key + "=" + value + "&"
    })

    this.RssFeedResultUrl = this.RssFeedResultUrl.substring(0, this.RssFeedResultUrl.length-1)

    console.log(this.RssFeedResultUrl)
    return this.RssFeedResultUrl;
    
  }

  GetHtml() {
    const requestOptions: Object = {
    };

    this.http
        .get<any>(
          this.GenerateRssFeedResultUrl(),
          requestOptions
        )
        .subscribe((data) => {
          this.RssDataInlineText = data;
        });
  }

  rssUrlChange(e: string) {

    // TODO: if valid url
    if(true) {
      this.RssFeedUrl = e;
    }

    console.log("RSS Feed changed for: " + this.RssFeedUrl)
    this.refresh();
  }

  rssTakeChange(e: string) {
    let count = parseInt(e)
    this.RssFeedTake = count;
    this.refresh();
  }

  rssTextScrollSpeedChange(e: string){
    let speed = parseFloat(e);
    this.SpeedTime = speed;
    this.Speed = this.SpeedTime + "s"
    console.log("Change Scroll Speed")
    this.refresh();
  }

  rssColorChange(e: string){
    this.Color = e;
    this.refresh();
  }
}
