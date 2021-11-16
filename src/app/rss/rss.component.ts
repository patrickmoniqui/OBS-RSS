import { Component, OnInit } from '@angular/core';
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
  SpeedTime = 50;
  Speed = "marquee " + this.SpeedTime + "s linear infinite";
  RssCount = 5;
  RssUrl: string = ""

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: any) => {
      var symbol = params.params.q ?? 'AAPL';
      this.GetRssFeedData(symbol);
    });
  }

  GetRssFeedData(symbol: any) {
    const requestOptions: Object = {
      observe: 'body',
      responseType: 'text'
    };
    const _url = "https://www.espn.com/espn/rss/news";
    this.http
      .get<any>(
        _url,
        requestOptions
      )
      .subscribe((data) => {
        const parser = require('fast-xml-parser');

        const options = {};

        try{
          this.RssData = parser.parse(data, options, true);

          if(this.RssCount == -1){
            this.RssCount = this.RssData.rss.channel.item.length
          }

          for(let i =0;i < this.RssCount; i++) {
            let rss = this.RssData.rss.channel.item[i]

            if(i == this.RssData.rss.channel.item.length -1) {
              this.RssDataInlineText += rss.title + ": " + rss.description + " | "
              break;
            }

            this.RssDataInlineText += rss.title + ": " + rss.description;
          }

        }
        catch(error){
          console.log(error)
        }
      });
  }

}
