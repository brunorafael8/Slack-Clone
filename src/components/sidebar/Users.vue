<template>

    <div class="users__container">
        <h2 class="ui inverted center aligned header">Users</h2>
        <div class="ui feed" v-for="user in users" :key="user.uid" :class="{'is_active' : isActive(user)}" @click.prevent="changeChannel(user)">
            <div class="event">
                <div class="label">
                    <img :src="user.avatar" alt="avatar">
                </div>
                <div class="content">
                    <span class="ui empty circular label connection__label" :class="{'olive': isOnline(user), 'red': !isOnline(user)}"></span> {{ user.name }}
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import { mapGetters } from 'Vuex'
    export default {
        name: 'users',
        data() {
            return {
                users: [],
                usersRef: firebase.database().ref('users'),
                connectedRef: firebase.database().ref('.info/connected'),
                presenceRef: firebase.database().ref('presence')
            }
        },
        computed: {
            ...mapGetters(['currentUser', 'currentChannel'])
        },
        mounted() {
            this.addListeners()
        },
        methods: {
            addListeners() {
                this.usersRef.on('child_added', snap => {
                    if (this.currentUser.uid !== snap.key) {
                        let user = snap.val()
                        user['uid'] = snap.key
                        user['status'] = 'offline'
                        this.users.push(user)
                    }
                })
                //Check du status utilisateur
                this.presenceRef.on('child_added', snap => {
                    if(this.currentUser.uid !== snap.key){
                        this.addStatusToUser(snap.key)
                    }
                })
                this.presenceRef.on('child_removed', snap => {
                     if(this.currentUser.uid !== snap.key){
                        this.addStatusToUser(snap.key, false)
                    }
                })
                this.connectedRef.on('value', snap => {
                    if(snap.val() === true){
                        let ref  = this.presenceRef.child(this.currentUser.uid)
                        ref.set(true)
                        ref.onDisconnect().remove( err => {
                            if(err !== null) console.log(err)
                        })
                    }
                })
            },
            addStatusToUser(userId, connected = true){
                let index = this.users.findIndex( user => user.uid === userId)
                if(index !== -1){
                    connected === true ? this.users[index].status = 'online' : this.users[index].status = 'offline'
                }
            },            
            isOnline(user){
                return user.status == 'online'
            },
            changeChannel(user){
                let channelId = this.getChannelId(user.uid)
                let channel = { id: channelId, name: user.name}
                this.$store.dispatch('setPrivate', true)
                this.$store.dispatch('setCurrentChannel', channel)
            },
            isActive(user){
                let channelId = this.getChannelId(user.uid)
                return this.currentChannel.id === channelId
            },
            getChannelId(userId){
                return userId < this.currentUser.uid ? userId+'/'+this.currentUser.uid : this.currentUser.uid + '/'+userId
            },
            detachListeners() {
                this.usersRef.off()
                this.presenceRef.off()
                this.connectedRef.off()
            }
        },
        beforeDestroy() {
            this.detachListeners()
        }
    }
</script>

<style scoped>
.users__container{
        overflow-y: auto;
    }
    .users__container .feed{
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        color: #ab9ba9
    }
    .users__container .feed:hover{
        background: #3e313c;
    }
    .users__container .feed.is_active{
        color: #fff;
        background: rgba(0,158,195,1);
    }
    .connection__label{
        float:left!important;
        margin-right: 12px!important;
        margin-top: 5px;
    }
</style>
