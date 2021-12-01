import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NewsRss } from '../model/RssData';
import { Location } from '@angular/common';

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

  RssFeedTake: number = 0
  RssFeedResultUrl: string = ""
  
  Color = '#000000'

  FontSize: string = "32"

  RefreshInterval: number = 900;

  NewsTextSeperator: string = " | "

  TitleDescriptionSeparator: string = " : "

  location: Location;

  constructor(private http: HttpClient, private route: ActivatedRoute, location: Location) {
    this.location = location;
   }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: any) => {
      var symbol = params.params.q ?? 'AAPL';
      this.refresh();
    });

    console.log(this.location)
  }

  refresh() {
    this.GenerateRssFeedResultUrl()
  }

  copyUrl() {
    var text = this.GenerateRssFeedResultUrl()

    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
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
      queryParams.set('color', encodeURIComponent(this.Color))
    }

    if(this.NewsTextSeperator) {
      queryParams.set('separator', encodeURIComponent(this.NewsTextSeperator))
    }

    if(this.FontSize) {
      queryParams.set('fontSize', this.FontSize)
    }

    if(this.RefreshInterval) {
      queryParams.set('refreshInterval', this.RefreshInterval)
    }

    if(this.TitleDescriptionSeparator) {
      queryParams.set('titleDescriptionSeparator', this.TitleDescriptionSeparator)
    }

    queryParams.forEach( (value, key) => {
      this.RssFeedResultUrl += key + "=" + value + "&"
    })

    this.RssFeedResultUrl = this.RssFeedResultUrl.substring(0, this.RssFeedResultUrl.length-1)
    return this.RssFeedResultUrl;
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

  fontSizeChange(e: string){
    this.FontSize = e;
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

  refreshIntervalChange(e: string){
    this.RefreshInterval = parseInt(e);
    this.refresh();
  }
}
