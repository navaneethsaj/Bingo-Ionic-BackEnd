(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{"8cDG":function(l,n,u){"use strict";u.r(n);var e=u("8Y7J");class t{}var o=u("pMnS"),i=u("MKJQ"),a=u("sZkV"),r=u("s7LF"),b=u("SVse"),s=u("mNHU"),c=u("gag3"),g=u("EVdn");class h{constructor(l,n){this.http=l,this.gameInstanceService=n,this.ranklist=[],this.myranks="Calculating your score",this.myscore="0",this.username="",this.loading=!1,this.getscoreboard(),this.getmyrank(),setInterval(()=>{this.myscore=localStorage.getItem("myscore")||"0",this.username=localStorage.getItem("username")||""},2e3),g(document).ready(()=>{this.gameInstanceService.playanim(document.getElementById("loading_anim"),"loading.json",!0,!0)})}signUp(l,n,u){if(void 0===l||void 0===u||void 0===n)return void this.gameInstanceService.presentToast("Enter required data");if(l.length<2||u.length<2||n.length<4)return void this.gameInstanceService.presentToast("Enter required data");if(!this.validateEmail(n))return void console.log("invalid email");this.gameInstanceService.presentToast("Please wait...");const e=localStorage.getItem("myscore")||0;this.http.post(c.a.baseurl+"/auth/register",{username:l,password:u,email:n,score:e},{withCredentials:!0}).subscribe(l=>{this.gameInstanceService.presentToast(l.msg),200===l.status&&(localStorage.setItem("loginid",l.id),localStorage.setItem("username",l.username),console.log(l.id))})}validateEmail(l){const n=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;return n.test(l)||this.gameInstanceService.presentToast("Enter Valid Email ID"),n.test(l)}signIn(l,n){if(void 0===n||void 0===l)return void this.gameInstanceService.presentToast("Enter required data");if(n.length<2||l.length<4)return void this.gameInstanceService.presentToast("Enter required data");if(!this.validateEmail(l))return void console.log("invalid email");this.gameInstanceService.presentToast("Please wait...");const u=Number(localStorage.getItem("myscore"));this.http.post(c.a.baseurl+"/auth/login",{password:n,email:l,score:u},{withCredentials:!0}).subscribe(l=>{this.gameInstanceService.presentToast(l.msg),200===l.status&&(localStorage.setItem("loginid",l.id),localStorage.setItem("myscore",l.score),localStorage.setItem("username",l.username),console.log(l.id),this.getmyrank())})}segmentChanged(l){this.segmentvalue=l.detail.value}isAuthenticated(){return void 0!==localStorage.getItem("loginid")&&null!==localStorage.getItem("loginid")}getmyrank(){const l=localStorage.getItem("loginid");null!=l?this.http.post(c.a.baseurl+"/score/my",{id:l}).subscribe(l=>{console.log("my rank",l),this.myranks=l.ranks||"Calculating your rank"}):this.myranks="Sign in to know"}getscoreboard(){this.getmyrank(),this.loading=!0,this.http.get(c.a.baseurl+"/score").subscribe(l=>{console.log(l),this.ranklist=l.ranks||[],this.loading=!1})}}var p=u("IheW"),d=e.nb({encapsulation:0,styles:[["ion-content[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%]{--background:translucent}"]],data:{}});function m(l){return e.Fb(0,[(l()(),e.pb(0,0,null,null,1,"ion-icon",[["name","refresh-outline"]],null,[[null,"click"]],(function(l,n,u){var e=!0;return"click"===n&&(e=!1!==l.component.getscoreboard()&&e),e}),i.S,i.p)),e.ob(1,49152,null,0,a.z,[e.h,e.k,e.x],{name:[0,"name"]},null)],(function(l,n){l(n,1,0,"refresh-outline")}),null)}function v(l){return e.Fb(0,[(l()(),e.pb(0,0,null,null,19,"div",[["style","padding: 10px"]],null,null,null,null,null)),(l()(),e.pb(1,0,null,null,3,"ion-input",[["placeholder","give a fancy user name"]],null,[[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var t=!0;return"ionBlur"===n&&(t=!1!==e.Ab(l,4)._handleBlurEvent(u.target)&&t),"ionChange"===n&&(t=!1!==e.Ab(l,4)._handleInputEvent(u.target)&&t),t}),i.T,i.q)),e.Bb(5120,null,r.b,(function(l){return[l]}),[a.Hb]),e.ob(3,49152,[["username",4]],0,a.D,[e.h,e.k,e.x],{placeholder:[0,"placeholder"]},null),e.ob(4,16384,null,0,a.Hb,[e.k],null,null),(l()(),e.pb(5,0,null,null,3,"ion-input",[["placeholder","your email id"]],null,[[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var t=!0;return"ionBlur"===n&&(t=!1!==e.Ab(l,8)._handleBlurEvent(u.target)&&t),"ionChange"===n&&(t=!1!==e.Ab(l,8)._handleInputEvent(u.target)&&t),t}),i.T,i.q)),e.Bb(5120,null,r.b,(function(l){return[l]}),[a.Hb]),e.ob(7,49152,[["email",4]],0,a.D,[e.h,e.k,e.x],{placeholder:[0,"placeholder"]},null),e.ob(8,16384,null,0,a.Hb,[e.k],null,null),(l()(),e.pb(9,0,null,null,3,"ion-input",[["placeholder","enter password"]],null,[[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var t=!0;return"ionBlur"===n&&(t=!1!==e.Ab(l,12)._handleBlurEvent(u.target)&&t),"ionChange"===n&&(t=!1!==e.Ab(l,12)._handleInputEvent(u.target)&&t),t}),i.T,i.q)),e.Bb(5120,null,r.b,(function(l){return[l]}),[a.Hb]),e.ob(11,49152,[["password",4]],0,a.D,[e.h,e.k,e.x],{placeholder:[0,"placeholder"]},null),e.ob(12,16384,null,0,a.Hb,[e.k],null,null),(l()(),e.pb(13,0,null,null,6,"ion-button",[["expand","block"]],null,[[null,"click"]],(function(l,n,u){var t=!0;return"click"===n&&(t=!1!==l.component.signUp(e.Ab(l,3).value,e.Ab(l,7).value,e.Ab(l,11).value)&&t),t}),i.E,i.b)),e.ob(14,49152,[["signup",4]],0,a.h,[e.h,e.k,e.x],{expand:[0,"expand"]},null),(l()(),e.pb(15,0,null,0,2,"ion-label",[["slot","end"]],null,null,null,i.V,i.s)),e.ob(16,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.Eb(-1,0,["Sign Up"])),(l()(),e.pb(18,0,null,0,1,"ion-icon",[["name","add-outline"],["slot","start"]],null,null,null,i.S,i.p)),e.ob(19,49152,null,0,a.z,[e.h,e.k,e.x],{name:[0,"name"]},null)],(function(l,n){l(n,3,0,"give a fancy user name"),l(n,7,0,"your email id"),l(n,11,0,"enter password"),l(n,14,0,"block"),l(n,19,0,"add-outline")}),null)}function k(l){return e.Fb(0,[(l()(),e.pb(0,0,null,null,15,"div",[["style","padding: 10px"]],null,null,null,null,null)),(l()(),e.pb(1,0,null,null,3,"ion-input",[["placeholder","your email id"]],null,[[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var t=!0;return"ionBlur"===n&&(t=!1!==e.Ab(l,4)._handleBlurEvent(u.target)&&t),"ionChange"===n&&(t=!1!==e.Ab(l,4)._handleInputEvent(u.target)&&t),t}),i.T,i.q)),e.Bb(5120,null,r.b,(function(l){return[l]}),[a.Hb]),e.ob(3,49152,[["email",4]],0,a.D,[e.h,e.k,e.x],{placeholder:[0,"placeholder"]},null),e.ob(4,16384,null,0,a.Hb,[e.k],null,null),(l()(),e.pb(5,0,null,null,3,"ion-input",[["placeholder","enter password"]],null,[[null,"ionBlur"],[null,"ionChange"]],(function(l,n,u){var t=!0;return"ionBlur"===n&&(t=!1!==e.Ab(l,8)._handleBlurEvent(u.target)&&t),"ionChange"===n&&(t=!1!==e.Ab(l,8)._handleInputEvent(u.target)&&t),t}),i.T,i.q)),e.Bb(5120,null,r.b,(function(l){return[l]}),[a.Hb]),e.ob(7,49152,[["password",4]],0,a.D,[e.h,e.k,e.x],{placeholder:[0,"placeholder"]},null),e.ob(8,16384,null,0,a.Hb,[e.k],null,null),(l()(),e.pb(9,0,null,null,6,"ion-button",[["expand","block"]],null,[[null,"click"]],(function(l,n,u){var t=!0;return"click"===n&&(t=!1!==l.component.signIn(e.Ab(l,3).value,e.Ab(l,7).value)&&t),t}),i.E,i.b)),e.ob(10,49152,[["signin",4]],0,a.h,[e.h,e.k,e.x],{expand:[0,"expand"]},null),(l()(),e.pb(11,0,null,0,2,"ion-label",[["slot","end"]],null,null,null,i.V,i.s)),e.ob(12,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.Eb(-1,0,["Sign In"])),(l()(),e.pb(14,0,null,0,1,"ion-icon",[["name","log-in-outline"],["slot","start"]],null,null,null,i.S,i.p)),e.ob(15,49152,null,0,a.z,[e.h,e.k,e.x],{name:[0,"name"]},null)],(function(l,n){l(n,3,0,"your email id"),l(n,7,0,"enter password"),l(n,10,0,"block"),l(n,15,0,"log-in-outline")}),null)}function f(l){return e.Fb(0,[(l()(),e.pb(0,0,null,null,19,"ion-card",[["style","margin: 0"]],null,null,null,i.J,i.c)),e.ob(1,49152,null,0,a.j,[e.h,e.k,e.x],null,null),(l()(),e.pb(2,0,null,0,13,"ion-segment",[],null,[[null,"ionChange"],[null,"ionBlur"]],(function(l,n,u){var t=!0,o=l.component;return"ionBlur"===n&&(t=!1!==e.Ab(l,5)._handleBlurEvent(u.target)&&t),"ionChange"===n&&(t=!1!==e.Ab(l,5)._handleChangeEvent(u.target)&&t),"ionChange"===n&&(t=!1!==o.segmentChanged(u)&&t),t}),i.Z,i.v)),e.Bb(5120,null,r.b,(function(l){return[l]}),[a.Gb]),e.ob(4,49152,null,0,a.fb,[e.h,e.k,e.x],null,null),e.ob(5,16384,null,0,a.Gb,[e.k],null,null),(l()(),e.pb(6,0,null,0,4,"ion-segment-button",[["value","signin"]],null,null,null,i.Y,i.w)),e.ob(7,49152,null,0,a.gb,[e.h,e.k,e.x],{value:[0,"value"]},null),(l()(),e.pb(8,0,null,0,2,"ion-label",[],null,null,null,i.V,i.s)),e.ob(9,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.Eb(-1,0,["Sign In"])),(l()(),e.pb(11,0,null,0,4,"ion-segment-button",[["value","signup"]],null,null,null,i.Y,i.w)),e.ob(12,49152,null,0,a.gb,[e.h,e.k,e.x],{value:[0,"value"]},null),(l()(),e.pb(13,0,null,0,2,"ion-label",[],null,null,null,i.V,i.s)),e.ob(14,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.Eb(-1,0,["Sign Up"])),(l()(),e.eb(16777216,null,0,1,null,v)),e.ob(17,16384,null,0,b.i,[e.M,e.J],{ngIf:[0,"ngIf"]},null),(l()(),e.eb(16777216,null,0,1,null,k)),e.ob(19,16384,null,0,b.i,[e.M,e.J],{ngIf:[0,"ngIf"]},null)],(function(l,n){var u=n.component;l(n,7,0,"signin"),l(n,12,0,"signup"),l(n,17,0,"signup"===u.segmentvalue),l(n,19,0,"signin"===u.segmentvalue)}),null)}function x(l){return e.Fb(0,[(l()(),e.pb(0,0,null,null,10,"ion-item",[["color","light"]],null,null,null,i.U,i.r)),e.ob(1,49152,null,0,a.E,[e.h,e.k,e.x],{color:[0,"color"]},null),(l()(),e.pb(2,0,null,0,2,"ion-label",[],null,null,null,i.V,i.s)),e.ob(3,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.Eb(4,0,["",""])),(l()(),e.pb(5,0,null,0,2,"ion-label",[],null,null,null,i.V,i.s)),e.ob(6,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.Eb(7,0,["",""])),(l()(),e.pb(8,0,null,0,2,"ion-label",[["style","text-align: end"]],null,null,null,i.V,i.s)),e.ob(9,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.Eb(10,0,["",""]))],(function(l,n){l(n,1,0,"light")}),(function(l,n){l(n,4,0,n.component.ranklist.indexOf(n.context.$implicit)+1),l(n,7,0,n.context.$implicit.username),l(n,10,0,n.context.$implicit.score)}))}function y(l){return e.Fb(0,[(l()(),e.pb(0,0,null,null,3,"ion-item",[["color","light"],["style","text-align: center"]],null,null,null,i.U,i.r)),e.ob(1,49152,null,0,a.E,[e.h,e.k,e.x],{color:[0,"color"]},null),(l()(),e.pb(2,0,null,0,1,"div",[["style","text-align: center"]],null,null,null,null,null)),(l()(),e.Eb(3,null,["",""]))],(function(l,n){l(n,1,0,"light")}),(function(l,n){l(n,3,0,n.component.username)}))}function I(l){return e.Fb(0,[(l()(),e.pb(0,0,null,null,12,"ion-header",[],null,null,null,i.R,i.o)),e.ob(1,49152,null,0,a.y,[e.h,e.k,e.x],{translucent:[0,"translucent"]},null),(l()(),e.pb(2,0,null,0,10,"ion-toolbar",[],null,null,null,i.fb,i.C)),e.ob(3,49152,null,0,a.wb,[e.h,e.k,e.x],null,null),(l()(),e.pb(4,0,null,0,8,"ion-item",[],null,null,null,i.U,i.r)),e.ob(5,49152,null,0,a.E,[e.h,e.k,e.x],null,null),(l()(),e.pb(6,0,null,0,4,"ion-label",[],null,null,null,i.V,i.s)),e.ob(7,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.pb(8,0,null,0,2,"ion-title",[],null,null,null,i.eb,i.B)),e.ob(9,49152,null,0,a.ub,[e.h,e.k,e.x],null,null),(l()(),e.Eb(-1,0,[" Score Board "])),(l()(),e.eb(16777216,null,0,1,null,m)),e.ob(12,16384,null,0,b.i,[e.M,e.J],{ngIf:[0,"ngIf"]},null),(l()(),e.pb(13,0,null,null,19,"ion-content",[],null,null,null,i.L,i.i)),e.ob(14,49152,null,0,a.r,[e.h,e.k,e.x],null,null),(l()(),e.eb(16777216,null,0,1,null,f)),e.ob(16,16384,null,0,b.i,[e.M,e.J],{ngIf:[0,"ngIf"]},null),(l()(),e.pb(17,0,null,0,0,"div",[["id","loading_anim"],["style","margin-top: 2%; height: 5%"]],[[8,"hidden",0]],null,null,null,null)),(l()(),e.pb(18,0,null,0,14,"ion-list",[],null,null,null,i.W,i.t)),e.ob(19,49152,null,0,a.L,[e.h,e.k,e.x],null,null),(l()(),e.pb(20,0,null,0,10,"ion-item",[["color","light"]],null,null,null,i.U,i.r)),e.ob(21,49152,null,0,a.E,[e.h,e.k,e.x],{color:[0,"color"]},null),(l()(),e.pb(22,0,null,0,2,"ion-label",[],null,null,null,i.V,i.s)),e.ob(23,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.Eb(-1,0,["Rank"])),(l()(),e.pb(25,0,null,0,2,"ion-label",[],null,null,null,i.V,i.s)),e.ob(26,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.Eb(-1,0,["User Name"])),(l()(),e.pb(28,0,null,0,2,"ion-label",[["style","text-align: end"]],null,null,null,i.V,i.s)),e.ob(29,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.Eb(-1,0,["Score"])),(l()(),e.eb(16777216,null,0,1,null,x)),e.ob(32,278528,null,0,b.h,[e.M,e.J,e.q],{ngForOf:[0,"ngForOf"]},null),(l()(),e.pb(33,0,null,null,11,"ion-footer",[],null,null,null,i.P,i.m)),e.ob(34,49152,null,0,a.w,[e.h,e.k,e.x],null,null),(l()(),e.eb(16777216,null,0,1,null,y)),e.ob(36,16384,null,0,b.i,[e.M,e.J],{ngIf:[0,"ngIf"]},null),(l()(),e.pb(37,0,null,0,7,"ion-item",[["color","light"]],null,null,null,i.U,i.r)),e.ob(38,49152,null,0,a.E,[e.h,e.k,e.x],{color:[0,"color"]},null),(l()(),e.pb(39,0,null,0,2,"ion-label",[],null,null,null,i.V,i.s)),e.ob(40,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.Eb(41,0,["Rank: ",""])),(l()(),e.pb(42,0,null,0,2,"ion-label",[["style","text-align: end"]],null,null,null,i.V,i.s)),e.ob(43,49152,null,0,a.K,[e.h,e.k,e.x],null,null),(l()(),e.Eb(44,0,["Score: ",""]))],(function(l,n){var u=n.component;l(n,1,0,!0),l(n,12,0,!u.loading),l(n,16,0,!u.isAuthenticated()),l(n,21,0,"light"),l(n,32,0,u.ranklist),l(n,36,0,u.username.length>0),l(n,38,0,"light")}),(function(l,n){var u=n.component;l(n,17,0,!u.loading),l(n,41,0,u.myranks),l(n,44,0,u.myscore)}))}function E(l){return e.Fb(0,[(l()(),e.pb(0,0,null,null,1,"app-tab2",[],null,null,null,I,d)),e.ob(1,49152,null,0,h,[p.c,s.a],null,null)],null,null)}var S=e.lb("app-tab2",h,E,{},{},[]),B=u("qtYk"),w=u("iInd");u.d(n,"Tab2PageModuleNgFactory",(function(){return C}));var C=e.mb(t,[],(function(l){return e.xb([e.yb(512,e.j,e.X,[[8,[o.a,S]],[3,e.j],e.v]),e.yb(4608,b.k,b.j,[e.s,[2,b.q]]),e.yb(4608,a.a,a.a,[e.x,e.g]),e.yb(4608,a.Bb,a.Bb,[a.a,e.j,e.p]),e.yb(4608,a.Eb,a.Eb,[a.a,e.j,e.p]),e.yb(4608,r.g,r.g,[]),e.yb(1073742336,b.b,b.b,[]),e.yb(1073742336,a.yb,a.yb,[]),e.yb(1073742336,r.f,r.f,[]),e.yb(1073742336,r.a,r.a,[]),e.yb(1073742336,B.a,B.a,[]),e.yb(1073742336,w.o,w.o,[[2,w.t],[2,w.m]]),e.yb(1073742336,t,t,[]),e.yb(1024,w.k,(function(){return[[{path:"",component:h}]]}),[])])}))}}]);