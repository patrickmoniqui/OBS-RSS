import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NewsRss } from 'src/app/model/RssData';
import { timer } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inline-text',
  templateUrl: './inline-text.component.html',
  styleUrls: ['./inline-text.component.scss']
})
export class InlineTextComponent implements OnInit {
  @Input('url')
  RssFeedUrl: string = ""

  RssData: NewsRss = {} as NewsRss;
  RssFeedTake: number = 0;

  @Input('speed')
  Speed: number = 60;

  FontSize = '32px';

  @Input('color')
  Color: string = 'black'

  RssDataInlineText: string = "";

  Timer: Observable<number> | undefined;

  @Input('refresh')
  RefreshInterval: number = 5000;

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
            this.FontSize = parseInt(params.get(element)!) + 'px';
            console.log("fontSize: " + this.FontSize)
          }

          if (element === 'color') {
            this.Color = params.get(element)!
          }

          if (element === 'scrollSpeed') {
            this.Speed = parseFloat(params.get(element)!)
          }

          if (element === 'refresh'){
            this.RefreshInterval
          }

        });
      });
      this.observableTimer(this.RefreshInterval)
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
                this.RssDataInlineText += rss.title + ": " + rss.description + " | "
                break;
              }
              this.RssDataInlineText += rss.title + ": " + rss.description;
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
