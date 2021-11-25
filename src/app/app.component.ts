import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];//we will loop the output with this array
  isFetching = false;
  error = null; //handle errors, default as null so it should not be shown when everything is working smoothly

  myError = null;
  private myErrorSub: Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) {}

  ngOnInit() {
    //error handling from posts.service.ts
    this.myErrorSub = this.postsService.myError.subscribe(myErrorMessage => {
      this.myError = myErrorMessage;
    })
    //fetch post whenever the app loads
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.message;
    });
  }

  onCreatePost(postData: Post) {//from interface in post.model.ts
    // Send Http request
    this.postsService.createAndStorePost(postData.title, postData.content);//passing the two datas from post.service.ts
  }

  onFetchPosts() {
    // fetch post
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.message;
    });
  }

  onClearPosts() {
    // clear/delete all Http requests
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];//"reset" it
    });
  }


  /*private fetchPosts() {
    this.isFetching = true; outside this, it is false. but when it is fetching, we can set a loading sign while fetching posts*/

    ngOnDestroy() {
      this.myErrorSub.unsubscribe();
    }

}
