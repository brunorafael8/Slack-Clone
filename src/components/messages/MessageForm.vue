<template>
    
    <div class="messages__form">
        <div class="ui inverted form">
            <form action="" id="form">
                <div class="two fields">

                    <div class="field">
                        <textarea name="message" @keydown.ctrl.enter.prevent="submit" id="message" v-model.trim="message" rows="3" placeholder="Message"></textarea>
                    </div>

                    <div class="field">
                        <button class="ui green button"  @submit.prevent="sendMessage" @click.prevent="sendMessage">Send</button>
                        <button class="ui labeled icon button" @click.prevent="openFileModal"><i class="cloud upload icon"></i>Fichier</button>
                    </div>

                </div>
            </form>
        </div>

        <!-- Progress Bar Upload File -->
        <div class="ui small orange inverted progress" data-total="100" id="uploadedFile">

            <div class="bar">
                <div class="progress"></div>
            </div>
            <div class="label">{{ uploadLabel }}</div>

        </div>

        <!-- File modal -->
        <file-modal ref="file_modal"></file-modal>
    </div>
    
</template>

<script>
    import { mapGetters } from 'Vuex'
    import FileModal from './FileModal'
    import uuidV4 from 'uuid/V4'
    export default {
        name: 'message-form',
        components: { FileModal },
        data () {
            return {
                message: '',
                errors: [],
                storageRef: firebase.storage().ref(),
                uploadTask: null,
                uploadState: null,
            }
        },
        computed : {
            ...mapGetters(['currentChannel', 'currentUser']),
            uploadLabel () {
                switch(this.uploadState){
                    case 'uploading': return 'Envoi en cours...'
                        break;
                    case 'error': return 'Une erreur s\'est produite'
                        break;
                    case 'done': return 'Envoi effectué'
                        break;
                    default: return ''    
                }
            }
        },
        methods: {
            submit () {
                this.sendMessage()
            },
            sendMessage () { 
                if(this.currentChannel !== null){
                    if(this.message.length > 0){
                        //Envoi du message
                        this.$parent.messagesRef.child(this.currentChannel.id).push().set(this.createMessage()).then( () => {
                        }).catch( error => {
                            this.errors.push(error.message)
                        })
                    
                        this.message = ""
                    }
                }
            },
            createMessage () { 
                return {
                    content: this.message,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    user: {
                        name: this.currentUser.displayName,
                        avatar: this.currentUser.photoURL,
                        id: this.currentUser.uid
                    }
                }
                if(fileUrl == null){
                    message['content'] = this.message
                }else{
                    message['image'] = fileUrl
                }
                return message
            },
            uploadFile(file, metadata) {
                if(file === null) return false
                let pathToUpload = this.currentChannel.id
                let ref = this.$parent.getMessageRef()
                let filePath = this.getPath() + '/' + uuidV4() + '.jpg'
                //Upload du Fichier
                this.uploadTask = this.storageRef.child(filePath).put(file, metadata)
                this.uploadState = "uploading"
                this.uploadTask.on('state_changed', snap => {
                    // Upload en cours
                    let percent = (snap.bytesTransferred / snap.totalBytes) * 100
                    $("#uploadedFile").progress("set percent", percent)
                }, error => {
                    // Erreur
                    this.errors.push(error.message)
                    this.uploadState = 'error'
                    this.uploadTask = null
                }, () => {
                    // Upload finit
                    this.uploadState = 'done'
                    this.$refs.file_modal.resetForm()
                    //Récupération de l'url du Fichier
                    let fileUrl = this.uploadTask.snapshot.downloadURL
                    this.sendFileMessage(fileUrl, ref, pathToUpload)
                    
                })
            },
            sendFileMessage(fileUrl, ref, pathToUpload){
                
                ref.child(pathToUpload).push().set(this.createMessage(fileUrl)).then( () => {
                    this.$nextTick(() => {
                        $("html, body").scrollTop($(document).height())
                    })
                }).catch( error => {
                    this.errors.push(error.message)
                })
                
            },  
            openFileModal () {
                $("#fileModal").modal("show")
            },
            getPath() {
                if(this.isPrivate){
                    return 'schat/private/'+this.currentChannel.id
                }else{
                    return 'schat/public'
                }
            }
        },
        beforeDestroy () {
            if(this.uploadTask !== null){
                this.uploadTask.cancel()
                this.uploadTask = null
            }
        }
    }
</script>

<style scoped>
.messages__form{
        position: fixed;
        bottom: 0;
        background-color:#232323;
        width: 100%;
        margin: 0 0 0 -30px;
}
.shortcut{
    color:white;
}
.ui.small.progress{
    width: 70%;
}
</style>
