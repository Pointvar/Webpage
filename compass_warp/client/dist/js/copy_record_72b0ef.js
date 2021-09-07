(()=>{"use strict";var e,t={1498:(e,t,n)=>{var r=n(7462),a=n(7294),l=n(3935),c=n(9226),o=n(4634),s=n(5861),i=n(7757),u=n.n(i),m=n(9669),d=n.n(m),f=n(8470);d().defaults.headers["X-Requested-With"]="XMLHttpRequest",d().interceptors.response.use((function(e){var t=e.data;return t.success?t.data:(f.Z.error({title:"后端接口调用错误，请联系客服处理。",content:t.data.msg}),Promise.reject(t))}),(function(e){return f.Z.error({title:"后端接口调用错误，请联系客服处理。",content:e.response.statusText}),Promise.reject(e)}));const p=d();var h=function(e){return p.post("ajax_get_shop_info",e)},v=function(e){return p.post("ajax_create_copy_task",e)},y=function(e){return p.post("ajax_get_copy_complex_tasks",e)},E=function(e){return p.post("ajax_hide_copy_complex_tasks",e)},g=function(e){return p.post("ajax_get_logistic_templates",e)},_=function(e){return p.post("ajax_get_authorize_cats",e)},k=(0,o.hg)("common/getShopInfo",(0,s.Z)(u().mark((function e(){var t,n,r=arguments;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=r.length>0&&void 0!==r[0]?r[0]:{},e.next=3,h(t);case 3:return n=e.sent,e.abrupt("return",n);case 5:case"end":return e.stop()}}),e)})))),x=(0,o.oM)({name:"common",initialState:{shopInfo:{}},reducers:{},extraReducers:function(e){e.addCase(k.fulfilled,(function(e,t){e.shopInfo=t.payload}))}}),I=function(e){return e.common.shopInfo};const S=x.reducer;var b=(0,o.hg)("copy/createCopyTask",(0,s.Z)(u().mark((function e(){var t,n=arguments;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.length>0&&void 0!==n[0]?n[0]:{},e.next=3,v(t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})))),C=(0,o.hg)("copy/getCopyComplexTasks",(0,s.Z)(u().mark((function e(){var t,n=arguments;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.length>0&&void 0!==n[0]?n[0]:{},e.next=3,y(t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})))),Z=(0,o.hg)("copy/hideCopyComplexTasks",(0,s.Z)(u().mark((function e(){var t,n=arguments;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.length>0&&void 0!==n[0]?n[0]:{},e.next=3,E(t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})))),w=(0,o.hg)("copy/getLogisticTemplates",(0,s.Z)(u().mark((function e(){var t,n=arguments;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.length>0&&void 0!==n[0]?n[0]:{},e.next=3,g(t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})))),N=(0,o.hg)("copy/getAuthorizeCats",(0,s.Z)(u().mark((function e(){var t,n=arguments;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.length>0&&void 0!==n[0]?n[0]:{},e.next=3,_(t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})))),L={complexTasks:[],selectedKeys:[],filterData:{filterTitle:null,filterId:null,filterPlatform:"#ALL#",filterStatus:"#ALL#"},logisticTemplates:[],authorizeCats:[]},T=(0,o.oM)({name:"copy",initialState:L,reducers:{setFilterTitle:function(e,t){e.filterData.filterTitle=t.payload},setFilterId:function(e,t){e.filterData.filterId=t.payload},setFilterPlatform:function(e,t){e.filterData.filterPlatform=t.payload},setfilterStatus:function(e,t){e.filterData.filterStatus=t.payload},setFilterData:function(e){e.filterData=L.filterData},setSelectedKeys:function(e,t){e.selectedKeys=t.payload}},extraReducers:function(e){e.addCase(b.fulfilled,(function(){})),e.addCase(C.fulfilled,(function(e,t){e.complexTasks=t.payload})),e.addCase(Z.fulfilled,(function(e,t){e.complexTasks=t.payload,e.selectedKeys=[]})),e.addCase(w.fulfilled,(function(e,t){e.logisticTemplates=t.payload.map((function(e){return{key:e.template_id,value:e.template_name}}))})),e.addCase(N.fulfilled,(function(e,t){e.authorizeCats=t.payload}))}}),F=T.actions,O=F.setFilterTitle,j=F.setFilterId,A=F.setFilterPlatform,P=F.setfilterStatus,D=F.setFilterData,M=F.setSelectedKeys,K=function(e){return e.copy.complexTasks},R=function(e){return e.copy.selectedKeys},H=function(e){return e.copy.filterData};const q=T.reducer,z=(0,o.xC)({reducer:{common:S,copy:q}});var W=n(7183),Q=n(9772),V=n(5241),X=n(1577),B=n(328),G=n(669),J=n(2925),U=n(9210),Y=n(7066),$=n(4e3),ee=n(5035),te=n(9447),ne=(n(63),W.Z.Header),re=a.createElement("div",{className:"user-popover",style:{display:"flex",justifyContent:"space-between",width:180}},a.createElement("a",{href:"/auth/pinduoduo_logout"},a.createElement($.Z,null),"切换账号"),a.createElement("a",{href:"/auth/pinduoduo_logout",style:{color:"red"}},a.createElement(ee.Z,null),"退出登陆"));const ae=function(e){var t=e.activeLink,n=e.NavMenus,r=e.shopInfo,l=r.shop_name,c=r.shop_logo;return a.createElement(ne,null,a.createElement("div",{className:"logo"},a.createElement("a",{href:"/index"},a.createElement("img",{src:te}))),a.createElement("div",{className:"menus"},a.createElement(U.Z,{theme:"dark",mode:"horizontal",defaultSelectedKeys:[t],style:{fontSize:20}},n.map((function(e){return a.createElement(U.Z.Item,{key:e.key},a.createElement("a",{href:e.link},e.name))})))),a.createElement(V.Z,{placement:"bottom",content:re,trigger:"hover"},a.createElement("div",{className:"user"},a.createElement("img",{src:c}),a.createElement("span",null,l))),a.createElement("div",{className:"operate"},a.createElement(X.Z,{type:"primary"},a.createElement("a",{href:"tencent://message/?uin=1655605815"},"联系我们(Windows)")),a.createElement(Y.Z,{title:"加入QQ群后联系管理员:958237009"},a.createElement(X.Z,{type:"primary"},"联系我们(MAC)"))))};var le=n(7031),ce=n(5779),oe=n(5443),se=le.Z.Option,ie=ce.Z.Search;const ue=function(e){var t=e.columns,n=e.statusMaps,r=e.platformMaps,l=e.dataSource,c=e.selectedKeys,o=e.rowSelection,s=e.onSearchTitle,i=e.onSearchId,u=e.onSearchPlatform,m=e.onSearchStatus,d=e.onClickRestSearch,f=e.onClickHideTasks;return a.createElement("div",{className:"table-area-box"},a.createElement("div",{className:"table_header"},a.createElement("div",{className:"filter_box"},a.createElement("div",{className:"filter_element"},a.createElement("span",{className:"label"},"标题搜索:"),a.createElement(ie,{placeholder:"支持商品标题模糊搜索",allowClear:!0,onSearch:s})),a.createElement("div",{className:"filter_element"},a.createElement("span",{className:"label"},"商品ID搜索:"),a.createElement(ie,{placeholder:"支持源ID和上货后ID搜索",allowClear:!0,style:{width:230},onSearch:i})),a.createElement("div",{className:"filter_element"},a.createElement("span",{className:"label"},"商品来源:"),a.createElement(le.Z,{defaultValue:"#ALL#",style:{width:84},onChange:u},r.map((function(e){var t=e.key,n=e.value;return a.createElement(se,{key:t,value:t},n)})))),a.createElement("div",{className:"filter_element"},a.createElement("span",{className:"label"},"上货状态:"),a.createElement(le.Z,{defaultValue:"#ALL#",style:{width:84},onChange:m},n.map((function(e){var t=e.key,n=e.value;return a.createElement(se,{key:t,value:t},n)})))),a.createElement(X.Z,{className:"filter_element",type:"primary",onClick:d},"搜索重置")),a.createElement("div",{className:"operator"},a.createElement("div",{className:"operator_info"},a.createElement("div",null,"已选择:",a.createElement("span",{className:"selectMessage"},c.length),"条"),a.createElement("div",null,"总记录:",l.length,"条")),a.createElement(oe.Z,{title:a.createElement("span",null,"亲，确定删除已选择的上货记录吗?",a.createElement("br",null),"该操作仅会删除软件内记录，不删除店铺内商品。"),okText:"确定",cancelText:"取消",onConfirm:f},a.createElement(X.Z,{type:"primary",danger:!0},"删除已选")))),a.createElement(B.Z,{tableLayout:"fixed",rowSelection:o,dataSource:l,columns:t,bordered:!0,rowKey:"_id"}))};var me=W.Z.Footer;const de=function(){return a.createElement(me,{className:"footer-container"},a.createElement("span",null,"杭州矩阵云网络技术有限公司版权所有©"),a.createElement("a",{href:"https://beian.miit.gov.cn/",target:"_blank",rel:"noreferrer"},"浙ICP备2021026933号"))};var fe=n(6486),pe=W.Z.Content,he={NavMenus:[{name:"一键复制",link:"/link-copy",key:"link-copy"},{name:"我的记录",link:"/copy_record",key:"copy_record"}],activeLink:"copy_record"},ve=[{key:"#ALL#",value:"全部"},{key:"#WAIT#",value:"等待中"},{key:"#PROCESS#",value:"处理中"},{key:"#FINISH#",value:"任务完成"},{key:"#FAIL#",value:"任务失败"}],ye=(0,fe.reduce)(ve,(function(e,t){return e[t.key]=t.value,e}),{}),Ee=(0,fe.reduce)([{key:"#WAIT#",value:"等待中"},{key:"#PROCESS#",value:"审核中"},{key:"#FINISH#",value:"审核通过"},{key:"#FAIL#",value:"审核驳回"}],(function(e,t){return e[t.key]=t.value,e}),{}),ge=[{key:"#ALL#",value:"全部"},{key:"taobao",value:"淘宝"},{key:"tianmao",value:"天猫"}],_e=(0,fe.reduce)(ge,(function(e,t){return e[t.key]=t.value,e}),{}),ke=[{title:"源商品信息",dataIndex:"src_item",width:400,align:"center",className:"src-item-info",ellipsis:!0,render:function(e,t){return t.main_pic&&t.itme_title?a.createElement(a.Fragment,null,a.createElement("img",{src:"".concat(t.main_pic,"_60x60q90.jpg")}),a.createElement("a",{href:t.copy_url},a.createElement("span",null,t.itme_title))):a.createElement("a",{href:t.copy_url},t.parsed_url)}},{title:"源商品ID",dataIndex:"src_num_iid",align:"center"},{title:"来源",dataIndex:"source",align:"center",render:function(e){return _e[e]}},{title:"上货时间",dataIndex:"c_time",align:"center"},{title:"商品ID",dataIndex:"dst_num_iid",align:"center"},{title:"上货状态",dataIndex:"status",align:"center",render:function(e,t){var n=ye[e],r=0,l="normal",c="rgb(0, 0, 0)";return"#PROCESS#"===e?(r=t.process_step,c="rgb(24, 144, 255)"):"#FINISH#"===e?(r=100,l="success",c="rgb(82, 195, 27)"):"#FAIL#"===e&&(r=100,l="exception",c="rgb(255, 77, 78)"),a.createElement(a.Fragment,null,a.createElement(Q.Z,{type:"circle",percent:r,status:l,width:40}),a.createElement("div",{className:"x",style:{color:c}},n))}},{title:"审核状态",dataIndex:"check_status",align:"center",render:function(e,t){var n,r=Ee[e],l=0,c="normal",o="rgb(0, 0, 0)";return"#PROCESS#"===e?(l=50,o="rgb(24, 144, 255)"):"#FINISH#"===e?(l=100,c="success",o="rgb(82, 195, 27)"):"#FAIL#"===e&&(l=100,c="exception",o="rgb(255, 77, 78)",n=a.createElement("span",null,"驳回原因: ",t.check_fail_msg,a.createElement("hr",null)," ",a.createElement("strong",null,"点击右侧编辑商品按钮编辑后提交。"))),n?a.createElement(V.Z,{placement:"top",content:n,trigger:"hover"},a.createElement(Q.Z,{type:"circle",percent:l,status:c,width:40}),a.createElement("div",{style:{color:o}},r)):a.createElement(a.Fragment,null,a.createElement(Q.Z,{type:"circle",percent:l,status:c,width:40}),a.createElement("div",{style:{color:o}},r))}},{title:"操作",key:"action",align:"center",render:function(e,t){var n;t.dst_num_iid&&("#FINISH#"===t.check_status?n="https://mms.pinduoduo.com/goods/goods_list/transfer?id=".concat(t.dst_num_iid):"#FAIL#"===t.check_status&&(n="https://mms.pinduoduo.com/goods/goods_return_detail?id=".concat(t.dst_num_iid)));var r=!n;return a.createElement("a",{href:n,target:"_blank",rel:"noreferrer"},a.createElement(X.Z,{type:"dashed",disabled:r},"编辑商品"))}}];function xe(){var e=(0,c.I0)(),t=(0,c.v9)(K),n=(0,c.v9)(I);(0,a.useEffect)((function(){e(k({})),e(C({}))}),[]);var l=(0,c.v9)(H),o=l.filterTitle,s=l.filterId,i=l.filterPlatform,u=l.filterStatus;o&&(t=t.filter((function(e){return(0,fe.includes)(e.itme_title,o)}))),s&&(t=t.filter((function(e){return(0,fe.isEqual)(e.src_num_iid,s)||(0,fe.isEqual)(e.dst_num_iid,s)}))),"#ALL#"!==i&&(t=t.filter((function(e){return(0,fe.isEqual)(e.source,i)}))),"#ALL#"!==u&&(t=t.filter((function(e){return(0,fe.isEqual)(e.status,u)})));var m=(0,c.v9)(R),d={selectedKeys:m,onChange:function(t){e(M(t))},selections:[B.Z.SELECTION_ALL,B.Z.SELECTION_NONE]};return a.createElement(a.Fragment,null,a.createElement(ae,(0,r.Z)({},he,{shopInfo:n})),a.createElement(pe,null,a.createElement(ue,{columns:ke,dataSource:t,rowSelection:d,statusMaps:ve,platformMaps:ge,selectedKeys:m,onSearchTitle:function(t){e(O(t))},onSearchId:function(t){e(j(t))},onSearchPlatform:function(t){e(A(t))},onSearchStatus:function(t){e(P(t))},onClickRestSearch:function(){e(D())},onClickHideTasks:function(){e(Z({in_ids:m}))}})),a.createElement(de,null))}l.render(a.createElement(G.ZP,{locale:J.Z},a.createElement(c.zt,{store:z},a.createElement(xe,null))),document.getElementById("root"))},9447:(e,t,n)=>{e.exports=n.p+"asset/kjsh_logo_b1979a.png"}},n={};function r(e){var a=n[e];if(void 0!==a)return a.exports;var l=n[e]={id:e,loaded:!1,exports:{}};return t[e].call(l.exports,l,l.exports,r),l.loaded=!0,l.exports}r.m=t,e=[],r.O=(t,n,a,l)=>{if(!n){var c=1/0;for(u=0;u<e.length;u++){for(var[n,a,l]=e[u],o=!0,s=0;s<n.length;s++)(!1&l||c>=l)&&Object.keys(r.O).every((e=>r.O[e](n[s])))?n.splice(s--,1):(o=!1,l<c&&(c=l));if(o){e.splice(u--,1);var i=a();void 0!==i&&(t=i)}}return t}l=l||0;for(var u=e.length;u>0&&e[u-1][2]>l;u--)e[u]=e[u-1];e[u]=[n,a,l]},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),r.j=809,r.p="/static/",(()=>{var e={809:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var a,l,[c,o,s]=n,i=0;for(a in o)r.o(o,a)&&(r.m[a]=o[a]);if(s)var u=s(r);for(t&&t(n);i<c.length;i++)l=c[i],r.o(e,l)&&e[l]&&e[l][0](),e[c[i]]=0;return r.O(u)},n=self.webpackChunkclient=self.webpackChunkclient||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var a=r.O(void 0,[736],(()=>r(1498)));a=r.O(a)})();