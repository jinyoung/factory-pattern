<template>
    <div>
        <h1 style = "margin-left:4.5%; margin-top:-10px; cursor:pointer;" @click="load">Application</h1>
        <v-select
                label="TYPE"
                :items="btnList"
                @change="changeType"
                style="margin-left:4.5%; width:300px;"
        ></v-select>
        <v-col style="margin-bottom:40px;">
            <div class="text-center">
                <v-dialog
                        v-model="openDialog"
                        width="332.5"
                        fullscreen
                        hide-overlay
                        transition="dialog-bottom-transition"
                >
                    <component :offline="offline" class="video-card" :isNew="true" :editMode="true" v-model="newValue" 
                            @add="append" v-if="tick" v-bind:is="childType"/>

                    <v-btn
                            style="postition:absolute; top:2%; right:2%"
                            @click="closeDialog()"
                            depressed
                            icon 
                            absolute
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-dialog>

                <v-speed-dial v-model="btnDialog" style="position: absolute; bottom: 5%; right: 2%; z-index:99">
                    <template v-slot:activator>
                        <v-btn color="blue" fab dark large>
                            <v-icon v-if="btnDialog">
                                mdi-close
                            </v-icon>
                            <v-icon v-else>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-btn 
                            v-for="(btn, idx) in btnList" :key="idx"
                            fab style="position:relative;"
                            @click="dialogOpen(btn)"
                    >
                        {{ btn }}
                    </v-btn>
                </v-speed-dial>
            </div>
        </v-col>
        <v-row>
            <component :offline="offline" class="video-card" 
                    v-for="(value, index) in values" v-bind:key="index"
                    v-model="values[index]" @delete="remove"
                    v-bind:is="values[index]._links.type.href.replace('/', '')"/>
        </v-row>
    </div>
</template>

<script>

    const axios = require('axios').default;
    import Application from './../Application.vue';

    export default {
        name: 'ApplicationManager',
        components: {
            Application,
        },
        props: {
            offline: Boolean
        },
        data: () => ({
            values: [],
            newValue: {},
            tick : true,
            openDialog : false,
            childType: '',
            btnDialog: false,
            btnList: [],
        }),
        async created() {
            var me = this;
            if(me.offline){
                if(!me.values) me.values = [];
                return;
            } 

            var temp = await axios.get(axios.fixUrl('/applications'))
            if(temp.data._embedded && typeof temp.data._embedded == 'object') {
                me.btnList = ["",];
                Object.values(temp.data._embedded).forEach(function(val) {
                    if(val.length > 0) {
                        me.values = [...me.values, ...val]
                    }
                })
            }
            
            me.newValue = {
                'presentation': '',
            }
        },
        methods:{
            dialogOpen(val) {
                this.childType = val;
                this.openDialog = true;
                this.btnDialog = false;
            },
            closeDialog(){
                this.openDialog = false
            },
            append(value){
                this.tick = false
                this.newValue = {}
                this.values.push(value)
                
                this.$emit('input', this.values);

                this.$nextTick(function(){
                    this.tick=true
                })
            },
            remove(value){
                var where = -1;
                for(var i=0; i<this.values.length; i++){
                    if(this.values[i]._links.self.href == value._links.self.href){
                        where = i;
                        break;
                    }
                }

                if(where > -1){
                    this.values.splice(i, 1);
                    this.$emit('input', this.values);
                }
            },
            async load() {
                var me = this;
                me.values = [];
                var temp = await axios.get(axios.fixUrl('/applications'))
                if(temp.data._embedded && typeof temp.data._embedded == 'object') {
                    me.btnList = ["AbcCompanyApplication",];
                    Object.values(temp.data._embedded).forEach(function(val) {
                        if(val.length > 0) {
                            me.values = [...me.values, ...val]
                        }
                    })
                }
            },
            async changeType(value) {
                var temp = await axios.get(axios.fixUrl('/' + value))
                if(temp.data._embedded) {
                    this.values = temp.data._embedded[value]
                }
            },
        }
    };
</script>


<style>
    .video-card {
        width:300px; 
        margin-left:4.5%; 
        margin-top:50px; 
        margin-bottom:50px;
    }
</style>

