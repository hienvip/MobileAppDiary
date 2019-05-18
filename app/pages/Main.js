import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    AsyncStorage,
    Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, Right, Icon, Header, Left, Body, Title, Tab, Tabs } from 'native-base';

import Note from '../components/Note';

export default class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                noteArray: [],
                noteCount: ''
            },
        }
    }

    render() {
        let notes = this.state.user.noteArray.map((val, key) => {
            return <Note key={key} keyval={key} val={val}
                deleteMethod={() => this.deleteNotePrompt(key)}
                editDiary={() => this.editDiary(key)}
            />
        });
        return (
            <View style={styles.container}>
                <Header hasTabs>
                    <Left>
                        <Button transparent>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Diary</Title>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name="search" />
                        </Button>
                    </Right>
                </Header>

                <Tabs>
                    <Tab heading='Diary' style={styles.tab1}>
                        <ScrollView style={styles.scrollContainer}>
                            {notes}
                        </ScrollView>
                    </Tab>
                </Tabs>

                <TouchableOpacity onPress={this.newDiary.bind(this)} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>{this.state.user.noteCount} Diaries</Text>
                </View>
            </View>
        );
    }

    newDiary() {
        Actions.newDiary({
            title: 'New Diary',
            noteText: '',
            check: Math.random()
        });
    }

    editDiary(key) {
        const editData = this.state.user.noteArray[key].note;
        Actions.newDiary({ title: 'Old Diary', keyInfo: key, noteText: editData });
    }

    componentWillMount() {
        AsyncStorage.getItem('user').then(val => {
            try {
                const user = JSON.parse(val);
                this.setState({ user: user });
                console.log("MainPage data loaded: \n" + val);
            } catch (e) {
                console.log("MainPage componentWillMount Error: \n" + e);
            }
        });
    }
    
    deleteNote(key){
        const removedData = this.state.user.noteArray.splice(key, 1);
            // console.log("MainPage data has been removed: \n" + JSON.stringify(removedData));
            this.state.user.noteCount = --this.state.user.noteCount;
            const update = Object.assign({}, this.state.user, {
                noteArray: this.state.user.noteArray,
                noteCount: this.state.user.noteCount
            })
            this.setState({ update })
            AsyncStorage.setItem('user', JSON.stringify(this.state.user))
    }
    deleteNotePrompt() {
        Alert.alert(
            'Delete this note',
            'You are about to delete this note. Are you sure?',
            [
              {text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
              {text: 'YES', onPress: () => this.deleteNote()}
            ]
          )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    footer: {
        position: 'absolute',
        backgroundColor: '#E91E63',
        alignItems: 'center',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10
    },
    footerText: {
        fontSize: 16,
        color: 'white',
        padding: 5
    },
    addButton: {
        position: 'absolute',
        zIndex: 11,
        right: 10,
        bottom: 2,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8
    },
    tab1: {
        backgroundColor: '#F8F8FF',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24
    }
});
