<template>

    <div class="messages__container">
        <div class="messages__content">
            <h2 class="ui inverted center aligned header">{{ channelName }}</h2>
            <div class="ui segment">
                <div class="ui comments">
                    <!-- Composant single message-->
                    <transition-group tag="div" name="list">
                        <single-message :message="message" v-for="message in messages" :key="message.id"></single-message>
                    </transition-group>
                </div>
            </div>

        </div>

        <!-- Formulaire d'envoi-->
        <message-form></message-form>

    </div>

</template>

<script>
    import MessageForm from './MessageForm'
    import SingleMessage from './SingleMessage'
    import { mapGetters } from 'Vuex'
    export default {
        name: 'messages',
        components: { MessageForm, SingleMessage },
        data () {
            return {
                messagesRef: firebase.database().ref('messages'),
                privateMessagesRef: firebase.database().ref('privateMessages'),
                messages: [],
                channel: null,
                listeners: []
            }
        },
        computed: {
            ...mapGetters(['currentChannel', 'currentUser', 'isPrivate']),
            channelName(){
                if(this.channel !== null){
                    return this.isPrivate ? '@ ' + this.channel.name : '# ' + this.channel.name 
                }
            }
        },
        watch : {
            currentChannel () {                
                this.detachListeners()
                this.addListeners()
                this.channel = this.currentChannel
            }
        },
        methods: {
            addListeners () {
                let ref = this.getMessageRef()
                ref.child(this.currentChannel.id).on('child_added', snap => {    
                    let message = snap.val()
                    message['id'] = snap.key               
                    this.messages.push(message)
                    this.$nextTick( () => {
                        $('html, body').scrollTop($(document).height())
                    })
                    
                    
                })
                this.addToListeners(this.currentChannel.id, ref, 'child_added')
            },
            addToListeners(id, ref, event){
                let index = this.listeners.findIndex( el => {
                    return el.id === id && el.ref === ref && el.event === event
                })
                if(index === -1){
                    this.listeners.push({id: id, ref: ref, event: event})
                }
            },
            detachListeners () {
                this.listeners.forEach( listener => {
                    listener.ref.child(listener.id).off(listener.event)
                })
                this.listeners = []
                this.messages = []
              
            },
            getMessageRef () {
                if(this.isPrivate){
                    return this.privateMessagesRef
                }else{
                    return this.messagesRef
                }
            }
        },
        beforeDestroy () {
            this.detachListeners()
        }
    }
</script>

<style scoped>
    .messages__container{
        position: relative;        
        background-color: #2a2a2e;        
        padding: 10px 30px 210px 30px; 
        margin-left: 300px;
        min-height: 100%;
    }
    .messages__container .comments{
        font-size: 1.2em;
    }  
    .list-enter-active{
        transition: all 0.3s
    }  
    .list-enter, .list-leave-to{
        opacity: 0;
        transform: translateX(30px);
    }
</style>
