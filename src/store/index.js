import {
    createStore
} from 'vuex'

export default createStore({
    state() {
        return {
            theme: '',
            listTransfer: {},
            leaveFlag: {},
            authData: {
                username: null,
                password: null
            },
            infoData: {
                tag: ''
            },
            listData: {
                info: {},
                relatedNews: [],
                requesting: true,
                ccpmNews: [],
                topNews: [],
                varietyNews: [],
                recommendNews: {
                    related: [],
                    favorite: [],
                    position: []
                },
                _24hourNews: []
            },
            // 直接进讨论需要的数据
            detailData: {},
            detailClicked: false,
            categoriesData: [
                
            ],
            allCategoriesData: [
                
            ],
            enterData: {},
            discuss_show: false,
            //路由过渡name
            routerTransitionName: '',
            //推荐已显示的新闻
            recommendShow: [],
            //路由历史
            routerList: [],
            //24小时界面的用户首次进入的引导提示
            is_tips_show:false,
            //24小时界面的用户首次进入的引导提示(订阅)
            tips_show_dy: false,
            //24小时界面的用户首次进入的引导提示(收藏)
            tips_show_sc: false,
            compareTime:true,
            //判断资讯收藏按时间排序升序降序
            red_dot:false,
            //第一次进入新闻详情获取红点
            read_message:false,
            //龙虎榜合约数据
            cc_contract:{},
            isIphoneX:false,
            //系统返回方法
            systemBack: null,
            isNewData:null,
            //判断龙虎榜是否是新合约切换
            hideAllToolTip:false,
            //点击外部echarts提示框隐藏
            oldModel:'0',//老龄化显示  1老龄化  0正常
        }
    },
    getters: {
        otherCategoriesData(state) {
            var _otherCategoriesData = [];
            for (var i = 0; i < state.allCategoriesData.length; i++) {
                var ifRepeat = false;
                for (var j = 0; j < state.categoriesData.length; j++) {
                    if (state.allCategoriesData[i].code === state.categoriesData[j].code) {
                        ifRepeat = true;
                    }
                }
                if (!ifRepeat) _otherCategoriesData.push(state.allCategoriesData[i])
            }
            return _otherCategoriesData;
        },
        computeCategoriesData(state) {
            var arr = [];
            var dataSelected = state.categoriesData;
            var dataAll = state.allCategoriesData;
            for (var i = 0; i < dataSelected.length; i++) {
                for (var j = 0; j < dataAll.length; j++) {
                    if (dataAll[j].code === dataSelected[i].code) {
                        arr.push(dataAll[j])
                    }
                }
            }
            return arr;
        }
    },
    mutations: {
        setTheme(state, payload) {
            state.theme = payload
        },
        setRecommendShow (state, payload) {
            state.recommendShow = payload
        },
        setlistTransfer(state, payload) {
            
            state.listTransfer = payload
        },
        setLeave(state, payload) {
            state.leaveFlag = payload
        },
        setAuth(state, payload) {
            state.authData = payload
        },
        setInfo(state, payload) {
            state.infoData = payload
        },
        setList(state, payload) {
            state.listData = Object.assign({}, state.listData, payload);
        },
        setCategories(state, payload) {
            state.categoriesData = payload
        },
        setAllCgr(state, payload) {
            state.allCategoriesData = payload
        },
        setDetail(state, payload) {
            state.detailData = payload
        },
        setDetailClicked(state, payload) {
            state.detailClicked = payload
        },
        cgrAdd(state, item) {
            state.categoriesData.push(item);
        },
        cgrRemove(state, index) {
            state.categoriesData.splice(index, 1);
        },
        setEnterData(state, payload) {
            state.enterData = payload
        },
        setDiscuss_show(state, payload) {
            state.discuss_show = payload
        },
        setRrouterTransitionName(state, payload) {
            state.routerTransitionName = payload
        },
        setRouterList (state, payload) {
            state.routerList = payload
        },
        //判断是否是进入过24小时界面
        isSetGuideTips (state, val) {
            state.is_tips_show = val
        },
        setGuideTips (state, val) {
            state.tips_show_dy = val
        },
        setGuideTips2 (state, val) {
            state.tips_show_sc = val
        },
        setCompareTime (state,val){
            state.compareTime = val;
        },
        setRedDot (state,val){
            state.red_dot = val;
        },
        setReadMessage (state,val){
            state.read_message = val;
        },
        setCcContract (state,val){
            state.cc_contract = val;
        },

        setIsIphoneX (state,val){
            state.isIphoneX = val
        },
        setSystemBack (state,val) {
            state.systemBack = val
        },
        setIsNewData (state,val) {
            state.isNewData = val
        },
        setHideTooltip(state,payload){
            state.hideAllToolTip = payload
        },
        setOldModel(state, payload) {
            state.oldModel = payload
        }
    }
})