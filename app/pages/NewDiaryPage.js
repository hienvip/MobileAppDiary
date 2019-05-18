import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class NewDiary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noteText: '',
            user: {
                noteArray:[]
            }
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>- {this.props.title} -</Text>
                </View>

                <TouchableOpacity onPress={() => this.saveDate(this.props)} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.returnBack} style={styles.returnButton}>
                    <Text style={styles.addButtonText}>Back</Text>
                </TouchableOpacity>
                <ScrollView style={styles.scrollContainer}>
                    <TextInput 
                        style={styles.textInput}
                        onChangeText={(val) => {
                            this.setState({noteText: val})                        
                        }}
                        value={this.state.noteText}
                        multiline = {true}
                        placeholderTextColor='white'
                        underlineColorAndroid='transparent'>    
                    </TextInput>   
                </ScrollView>
            </View>
        );
    }

    componentWillMount() {
        this.setState({noteText: this.props.noteText});

        //loading data
        AsyncStorage.getItem('user').then(val => {
            try{
                const user = JSON.parse(val);
                this.setState({user: user});
                console.log("MainPage data loaded: \n" + val);
            } catch (e) {
                console.log("MainPage componentWillMount Error: \n" + e);
            }
        });
    }

    returnMain() {
        saveDate();        
    }

    returnBack() {
        Actions.pop();
    }

    //Back from the New Diary Page and Save data
    saveDate(props){
        alert("Data saved");

        //If it's editing old diary
        if(props.keyInfo != null){
            this.state.user.noteArray[props.keyInfo].note = this.state.noteText;
            this.state.user.noteArray[props.keyInfo].changeCount++;
            const data = JSON.stringify(this.state.user);
            AsyncStorage.mergeItem('user', data);
            alert("MainPage newDiary has been edited \n");
            Actions.main()
        } 
        //Add new diary
        else {
            //date and time
            let d = new Date();
            let timeType = "AM";
            let hour = d.getHours();
            let minutes = d.getMinutes();
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            //alert(days[d.getDay()]);

            if(d.getHours() >= 12) {
                timeType = "PM";
                hour = hour - 12;
            }
            if(minutes < 10){
                minutes = '0' + minutes;
            }
            
            //check if there is no text
            let noteText = 'Nothing much today ~';
            if(this.state.noteText.length != 0){
                noteText = this.state.noteText;
            }

            this.state.user.noteArray.unshift({
                'note': noteText,
                'changeCount': 0,
                'date': {
                    month: (d.getMonth()+1),
                    date : d.getDate(),
                    year : d.getFullYear(),
                    weekday: days[d.getDay()]
                },
                'time': {
                    hour: hour,
                    minutes: minutes,
                    type: timeType
                }
            });
            const user = Object.assign({}, this.state.user, {
                noteArray: this.state.user.noteArray,
                noteCount: ++this.state.user.noteCount
            });
            
            const data = JSON.stringify(user);
            AsyncStorage.mergeItem('user', data);
            console.log("MainPage newDiary has been saved \n " + data);
            AsyncStorage.setItem('user', JSON.stringify(this.state.user))
        }
        //fucking pop and fucking refresh the previous screen
        Actions.main()    
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#E91E63',
        alignItems: 'center',
        justifyContent:'center',
        borderBottomWidth: 10,
        borderBottomColor: '#ddd'
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        paddingTop: 25,
        paddingBottom: 10
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 100
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10
    },
    textInput: {
        color: 'black',
        padding: 15,
        borderTopWidth:2,
        borderTopColor: '#ededed',
        height: 500
    },
    addButton: {
        position: 'absolute',
        zIndex: 11,
        right: 10,
        top: 27,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    },
    returnButton: {
        position: 'absolute',
        zIndex: 11,
        left: 10,
        top: 27,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16
    }
});
