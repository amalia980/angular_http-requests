import { Injectable } from "@angular/core";
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Post } from "./post.model";
import { map, tap } from "rxjs/operators";
import { Subject } from "rxjs";


@Injectable({providedIn: 'root'})//you can also get
export class PostsService {
  myError = new Subject<string>();//error handling with Subject. i have another name then "error", but using this. you have to modify the name in the html file where the message should be displayed

  constructor(private http: HttpClient) { }

  createAndStorePost(title: string, content: string) {
    const postData: Post = {title: title, content: content}

    this.http
      .post<{ name: string}>(
        'https://my-first-project-14f0f-default-rtdb.europe-west1.firebasedatabase.app/posts.json',postData,
        {
          observe: 'response'//console
        }
        /*'https://ng-complete-guide-c56d3.firebaseio.com/posts.json',
        postData -link from the course*/
      )
      .subscribe(responseData => {
        console.log(responseData);
       }/*, myError => {
         this.myError.next(myError.message);
      }*/);
  }

  //method to fetch post, getting the data
  //tip: good to use <> .get<>() on all requests to specify exactly what you are getting

  fetchPosts() {
    return this.http
    .get<{[key: string]: Post}>('https://my-first-project-14f0f-default-rtdb.europe-west1.firebasedatabase.app/posts.json', {
      headers: new HttpHeaders({'My-header-name': 'Hey'}),//set new key words in url
      params: new HttpParams().set('print', 'Excellent work!'),//set parameters in url, will be seen
      responseType: 'json'//json is the default, if you wanted 'text' here. it will not work. because .get<{}> specifically says its in object that is being passed. not a string in this case. .get() this would work though
    }
    )
    .pipe(
      map(responseData => {//map allows us to get some data and return new data, it automatically rewraps into an observable. so we can still subscribe to it. it takes reponseData as a function and is supposed to returen the converted responseData

      const postsArray: Post[] = [];//we convert our fethed js object data to an array
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          postsArray.push({ ...responseData[key], id: key });//outputting new data with new a object, with ...(spread), it pulls out the key value pairs of the nested object
        }
      }
      return postsArray;
      })
    );
  }

  deletePosts() {//if i want to be informed about the deleted posted, i will return the observable
    return this.http.delete('https://my-first-project-14f0f-default-rtdb.europe-west1.firebasedatabase.app/posts.json',//all posts will be deleted
    {
      observe: 'events',
      responseType: 'text'//the response should be a text, not a js object. so we can easily understand. you could also use 'blob' if its a file
    })
    .pipe(
      tap(event => {// to "'OBSERVE' types of responses". this is not used often. but when you need an execessive amount of control
        console.log(event);
        if (event.type === HttpEventType.Sent) {
          // ..
        }
        if (event.type === HttpEventType.Response) {
          console.log(event.body)
        }
      })
    )
  }
}
