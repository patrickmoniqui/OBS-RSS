import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NewsRss } from 'src/app/model/RssData';
import { timer } from 'rxjs';
import { Observable } from 'rxjs';
import { Console } from 'console';

@Component({
  selector: 'app-inline-text',
  templateUrl: './inline-text.component.html',
  styleUrls: ['./inline-text.component.scss']
})
export class InlineTextComponent implements OnInit {
  @Input('url')
  RssFeedUrl: string = ""

  RssData: NewsRss = {} as NewsRss;

  @Input('nbNews')
  RssFeedTake: number = 0;

  @Input('speed')
  Speed: number = 60;

  @Input('fontSize')
  FontSize = "32"

  @Input('color')
  Color: string = 'black'

  RssDataInlineText: string = "";

  Timer: Observable<number> | undefined;

  @Input('refreshInterval')
  RefreshInterval: number = 900;

  @Input('separator')
  NewsTextSeperator: string = " | "

  @Input('titleDescriptionSeparator')
  TitleDescriptionSeparator: string = " : "

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnChanges() {
    this.refresh()
  }

  refresh() {
    this.GetRssFeedData(null);
  }

  ngOnInit(): void {
    this.refresh()

    this.route.queryParamMap
      .subscribe((params) => {
        params.keys.forEach(element => {

          if (element === 'url') {
            this.RssFeedUrl = params.get(element)!;
            console.log("url: " + this.RssFeedUrl)
            this.GetRssFeedData(null);
          }

          if (element === 'fontSize') {
            this.FontSize = params.get(element)!;
            console.log("fontSize: " + this.FontSize)
          }

          if (element === 'color') {
            this.Color = params.get(element)!
          }

          if (element === 'scrollSpeed') {
            this.Speed = parseFloat(params.get(element)!)
          }

          if(element === 'separator') {
            this.NewsTextSeperator = params.get(element)!
          }

          if (element === 'refreshInterval'){
            this.RefreshInterval = parseInt(params.get(element)!)
          }

          console.log(params)

        });
      });
      this.observableTimer(this.RefreshInterval * 1000)
  }

  GetRssFeedData(symbol: any) {
    const requestOptions: Object = {
      observe: 'body',
      responseType: 'text'
    };

    if (this.RssFeedUrl !== "") {
      console.log("GET: " +  this.RssFeedUrl)
      this.http
        .get<any>(
          this.RssFeedUrl,
          requestOptions
        )
        .subscribe((data) => {
          const parser = require('fast-xml-parser');

          const options = {};

          try {
            this.RssData = parser.parse(data, options, true);
            console.log(this.RssData);

            if (this.RssFeedTake == 0) {
              this.RssFeedTake = this.RssData.rss.channel.item.length
            }

            console.log("RssFeedTake: " + this.RssFeedTake);

            this.RssDataInlineText = ""
            for (let i = 0; i < this.RssFeedTake; i++) {
              let rss = this.RssData.rss.channel.item[i]

              if (i == this.RssFeedTake - 1) {
                this.RssDataInlineText += rss.title + this.TitleDescriptionSeparator + rss.description;
                break;
              }
              this.RssDataInlineText += rss.title + this.TitleDescriptionSeparator + rss.description + this.NewsTextSeperator;
            }

            console.log("TEXT: " + this.RssDataInlineText)

          }
          catch (error) {
            console.log(error)
          }
        });
    }
  }

  observableTimer(intervalDuration: number) {
    this.Timer = timer(0, intervalDuration);
    
    this.Timer .subscribe(val => {
      this.refresh()
    });
  }
}
