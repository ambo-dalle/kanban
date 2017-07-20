<template lang="html">
	<div class="layout" >
		<div class="layout-content" style="">
			<hr>
			<Row style="text-align:center; margin:15px; font-size:24px; height:100px" >
				<Col><h1>KANBAN Version 1.0 </h1></Col>
				<h5>Welcome to the kamban</h5>
			</Row>
			<hr>
			<Row style="margin:15px;">
				<Col>
					<Button type="success" style="border-radius:5px;" @click="showModalNewTask = true">
						<Icon type="plus-round" style="width:200px; height:22px; font-size:24px; "></Icon>New Task
					</Button>
					<Modal v-model="showModalNewTask"	title="New Task"	:loading="loading" ok-text="Save"
					cancel-text="Cancel" @on-cancel="asyncCancel" @on-ok="asyncSave" style="background-color:#f1f1f1">
					<div class="input">
						<p><strong>Task Title</strong></p>
						<p><Input v-model="title" placeholder="Task Title" ></Input></p>
					</div>
					<div class="input">
						<p><strong>Description</strong></p>
						<p><Input v-model="description" type="textarea" :rows="3" placeholder="Task Description"></Input></p>
					</div>
					<div class="input">
						<p><strong>Point</strong></p>
						<p><Input v-model="point"></Input></p>
					</div>
					<div class="input">
						<p><strong>Assigned To Job</strong></p>
						<p><Input v-model="assignedTo" placeholder="Assigned To"></Input></p>
					</div>
				</Modal>
			</Col>
		</Row>

		<Modal v-model="showModalSticky" width="500" style="background-color:#f1f1f1">
			<p slot="header" style="color:#000;text-align:center">
				<Icon type="information-circled"></Icon>
				<span>{{ task.title }} Assigned to {{ task.assignedTo }}</span>
			</p>
			<div style="text-align:left">
				<p>Description : {{ task.description }}</p>
				<p>Point : {{ task.point }}</p>
			</div>
			<div slot="footer">
				<Button type="error" v-if="task.status>0" @click="updatePrev(task, task.status-1)">{{textPrev}}</Button>
				<Button type="warning" @click="deleteTask(task)">Delete</Button>
				<Button type="success" v-if="task.status<3" @click="updateNext(task, task.status+1)">{{textNext}}</Button>
			</div>
		</Modal>

		<Row style="margin : 10px;">
			<Col :xs="24" :sm="24" :md="6" :lg="6" style="margin : 0;">
				<Card :bordered="true" style="background-color:#97b5d7">
					<p slot="title">Back-Log</p>
					<p>
						<div class="card" v-for="(task,index) in tasks" v-if="task.status==0">
							<Card :bordered="true" style="background-color:#db8262">
								<p slot="title">{{task.title}}</p>
								<p>Point : {{task.point}}</p>
								<p>Assigned To : {{task.assignedTo}}</p>
								<p>
									<Button type="primary" style="border-radius:4px; width:100px" @click="showModal(task)">
										<Icon type="bookmark"></Icon>Detail Task
									</Button>
								</p>
							</Card>
						</div>
					</p>
				</Card>
			</Col>
			<Col :xs="24" :sm="24" :md="6" :lg="6" style="margin : 0;">
				<Card :bordered="true" style="background-color:#97b5d7">
					<p slot="title">To-Do</p>
					<p>
						<div class="card" v-for="(task,index) in tasks" v-if="task.status==1">
							<Card :bordered="true" style="background-color:#dba56b">
								<p slot="title">{{task.title}}</p>
								<p>Point : {{task.point}}</p>
								<p>Assigned To : {{task.assignedTo}}</p>
								<p>
									<Button type="primary" style="border-radius:4px; width:100px" @click="showModal(task)">
										<Icon type="bookmark"></Icon>Detail Task
									</Button>
								</p>
							</Card>
						</div>
					</p>
				</Card>
			</Col>
			<Col :xs="24" :sm="24" :md="6" :lg="6" style="margin : 0;">
				<Card :bordered="true" style="background-color:#97b5d7">
					<p slot="title">Doing</p>
					<p>
						<div class="card" v-for="(task,index) in tasks" v-if="task.status==2">
							<Card :bordered="true" style="background-color:#d8c461">
								<p slot="title">{{task.title}}</p>
								<p>Point : {{task.point}}</p>
								<p>Assigned To : {{task.assignedTo}}</p>
								<p>
									<Button type="primary" style="border-radius:4px; width:100px" @click="showModal(task)">
										<Icon type="bookmark"></Icon>Detail Task
									</Button>
								</p>
							</Card>
						</div>
					</p>
				</Card>
			</Col>
			<Col :xs="24" :sm="24" :md="6" :lg="6" style="margin : 0;">
				<Card :bordered="true" style="background-color:#97b5d7">
					<p slot="title" >Done</p>
					<p>
						<div class="card" v-for="(task,index) in tasks" v-if="task.status==3">
							<Card :bordered="true" style="background-color:#47cb89">
								<p slot="title">{{task.title}}</p>
								<p>Point : {{task.point}}</p>
								<p>Assigned To : {{task.assignedTo}}</p>
								<p>
									<Button type="primary" style="border-radius:4px; width:100px" @click="showModal(task)">
										<Icon type="bookmark"></Icon>Detail Task
									</Button>
								</p>
							</Card>
						</div>
					</p>
				</Card>
			</Col>
		</Row>
	</div>
	<div class="">

	</div>
</div>
</template>

<script>
import * as firebase from 'firebase'

var config = {
     apiKey: "AIzaSyCkZzHrERUFeWwZFw088nVugqCHqv-1hgs",
     authDomain: "webslide-a7384.firebaseapp.com",
     databaseURL: "https://webslide-a7384.firebaseio.com",
     projectId: "webslide-a7384",
     storageBucket: "webslide-a7384.appspot.com",
     messagingSenderId: "290531665249"
};
const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.database();
const tasksRef = db.ref('tasks')
export default {
	data(){
		return {
			showModalNewTask : false,
			title : '',
			description :'',
			point : 0,
			assignedTo : '',
			status: 0,
			loading: true,
			task : {
				taskId : null,
				title : null,
				description :null,
				point : null,
				assignedTo : null,
				status: null
			},
			textNext  : '',
			textPrev  : '',
			showModalSticky : false
		}
	},
	firebase: {
		tasks: tasksRef
	},
	methods : {
		showModal(task) {
			this.task = task
			this.showModalSticky = true
			this.prev()
			this.next()
		},
		next(){
			var self = this
			switch(self.task.status){
				case 0:
				self.textNext = 'To Do'
				break;
				case 1:
				self.textNext = 'Doing'
				break;
				case 2:
				self.textNext = 'Done'
				break;
				case 3:
				self.textNext = 'Done'
				break;
			}
		},
		prev(){
			var self = this
			switch(self.task.status){
				case 0:
				self.textPrev = 'Back Log'
				break;
				case 1:
				self.textPrev = 'Back Log'
				break;
				case 2:
				self.textPrev = 'To Do'
				break;
				case 3:
				self.textPrev = 'Doing'
				break;
			}
		},
		updateNext(task, newStatus){
			tasksRef.child(task['.key'])
			.child('status')
			.set(newStatus)
			this.showModalSticky = false
		},
		updatePrev(task, newStatus){
			tasksRef.child(task['.key'])
			.child('status')
			.set(newStatus)
			this.showModalSticky = false
		},
		deleteTask(task){
			this.$firebaseRefs.tasks.child(task['.key']).remove()
			this.showModalSticky = false
		},
		asyncSave(){
			var self = this
			let result = '';
			for (let i = length; i > 0; i--) {
				result += str[Math.floor(Math.random() * 15)];
			}
			var data = {
				taskId : result,
				title: self.title,
				description: self.description,
				point: self.point,
				assignedTo : self.assignedTo,
				status : self.status
			}
			tasksRef.push(data)
			setTimeout(() => {
				self.loading = false;
				self.showModalNewTask = false
				self.title = ''
				self.description =''
				self.point = 0
				self.assignedTo = ''
			}, 2000);
		},
		asyncCancel(){
			this.showModal = false
			this.title = ''
			this.description =''
			this.point = 0
			this.assignedTo = ''
		}
	}
}
</script>

<style scoped>

</style>
