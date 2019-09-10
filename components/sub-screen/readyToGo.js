import React from 'react'
import { Container, Text, Content, Header, View, Card, CardItem, Body, Left, Right,  } from 'native-base'
import Image from 'react-native-remote-svg';

const data = {
    waiting : {
        caption: "Tunggu pemesan bayar dulu ya",
        image: require('../../assets/images/payment-method.svg'),
    },
    ready : {
        caption: "Silahkan segera menuju ke pelanggan ...",
        image: require('../../assets/images/cycling.svg'),
    }
}

export default class WatingPayment extends React.Component {
    static navigationOptions = {
        header: null
    }
    render(){
        let label ='', image=''

        const keys = Object.keys(data)
        const finded = keys.find(key =>{
            if (key == this.props.tipe) {
                label = data[key].caption
                image = data[key].image
                return true
            } else {
                return false
            }
        } )

        if (typeof finded == "undefined") {
            return (<View><Text> Something Wrong </Text></View>)
        }

        return (
            <Container>
                <Header/>
                <Content contentContainerStyle={{ flex: 1 }}>
                    <View style={{ justifyContent: 'center', alignItems:'center', flex: 1 }}>
                        <Text style={{fontSize:19}}>{label}</Text>
                        <Image  
                            style={{width:200, height:200, marginTop:25}} 
                            source={image} />
                    </View>
                    <Card style={{marginLeft:10, marginRight:10}}>
                        <CardItem bordered first>
                            <Left><Text>Nama</Text></Left>
                            <Body><Text>Agus Marga Juanda</Text></Body>
                        </CardItem>
                        <CardItem bordered>
                            <Left><Text>Alamat</Text></Left>
                            <Body><Text>Jl.Blotan No.18, Blotan, Wedomartani, Kec. Ngemplak, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55584</Text></Body>
                        </CardItem>
                        <CardItem bordered last>
                            <Left><Text>No Kontak</Text></Left>
                            <Body><Text>0989898989898989</Text></Body>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        )
    }
}

WatingPayment.defaultProps = {
    tipe : 'ready' // waiting, ready
}