import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NewsRss } from 'src/app/model/RssData';

@Component({
  selector: 'app-inline-text',
  templateUrl: './inline-text.component.html',
  styleUrls: ['./inline-text.component.scss']
})
export class InlineTextComponent implements OnInit {
  RssFeedUrl: string = ""
  RssData: NewsRss = {} as NewsRss;
  RssFeedTake: number = -1;
  SpeedTime: number = 60;
  Speed: string = this.SpeedTime + "s";
  FontSize = '32px';
  Color: string = 'black'
  RssDataInlineText: string = "";

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe((params) => {
        params.keys.forEach(element => {
          console.log("Param: " + element + "=" + params.get(element)!);

          if(element === 'url') {
            this.RssFeedUrl = params.get(element)!;
            console.log("url: " + this.RssFeedUrl)
            this.GetRssFeedData(null);
          }
          if(element === 'fontSize') {
            this.FontSize = parseInt(params.get(element)!) + 'px';
            console.log("fontSize: " + this.FontSize)
          }
          if(element === 'color') {
            this.Color = params.get(element)!
          }
          if(element === 'scrollSpeed') {
            this.SpeedTime = parseFloat(params.get(element)!)
            this.Speed = this.SpeedTime + "s";
          }

        });
      });
    }

    GetRssFeedData(symbol: any) {
      const requestOptions: Object = {
        observe: 'body',
        responseType: 'text'
      };
      
      if(this.RssFeedUrl !== "") {
        this.http
        .get<any>(
          this.RssFeedUrl,
          requestOptions
        )
        .subscribe((data) => {
          const parser = require('fast-xml-parser');
  
          const options = {};
  
          try{
            this.RssData = parser.parse(data, options, true);
  
            if(this.RssFeedTake == -1){
              this.RssFeedTake = this.RssData.rss.channel.item.length
            }
  
            this.RssDataInlineText = ""
            for(let i =0;i < this.RssFeedTake; i++) {
              let rss = this.RssData.rss.channel.item[i]
  
              if(i == this.RssFeedTake -1) {
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
}
