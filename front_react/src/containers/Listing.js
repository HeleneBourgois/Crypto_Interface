import React, {Component, Fragment} from 'react'
import axios from 'axios'
import { Table, Modal, Button, Input, InputNumber, Select, Spin } from 'antd'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { connect } from 'react-redux'
import 'antd/dist/antd.css'
import { setCurrency } from './../actions/actions'

const signs = {
    USD: '$',
    EUR: '€',
    LTC: 'Ł',
    BTC: 'Ƀ'
}

const formatNumber = (number) => Number(number.toFixed(0)).toLocaleString("fr-FR").replace(/\./g, ' ')
const Option = Select.Option

class Listing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cryptos: [],
            initial: [],
            currency: 'USD',
            size: 100, 
            loading: true,
            visible: false
        }
    }
    
    componentDidMount() {
        axios.get('http://localhost:3000/', {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            params: {
                currency: this.state.currency,
                limit: this.state.size
            }
        })
        .then((response) => {
            this.setState({
                cryptos: response && response.data ? 
                response.data : [],
                initial: response && response.data ? 
                response.data : [],
                loading: false
            })
        })
        .catch((error) => {
            console.log(error)
        })   
    }

    changeCurrency = async (value) => {
        if (this.props && value) {
            this.setState({ loading: true })
            const data = await this.props.setCurrency(value, this.state.size) 
            if (data && data.payload) {
                this.setState({
                    cryptos: data.payload,
                    initial: data.payload,
                    currency: value,
                    loading: false
                })
            }
        }
    }

    changeSize = async (value) => {
        if (this.props && value) {
            this.setState({ loading: true })
            const data = await this.props.setCurrency(this.state.currency, value) 
            if (data && data.payload && data.payload.data) {
                this.setState({
                    cryptos: data.payload.data,
                    initial: data.payload.data,
                    size: value,
                    loading: false
                })
            }
        }
    }

    openModal = (e) => {
        this.setState({ 
            visible: e.target.id
        })
    }
     
    closeModal = () => {
        this.setState({ visible: false })
    }

    handleOk = (e) => {
        this.setState({ visible: false })
    }

    render() {

        const Search = Input.Search
        const data = this.state.cryptos
        const initial = this.state.initial
        const loader = this.state.loading
        const currency = this.state.currency
       
        return (
            <Fragment>
                <div className="input-fields">
                    <div className="search-cryptos"> 
                        <Search
                            placeholder="Search cryptos"
                            onChange={value => {
                                if (value && value.target && value.target.value && value.target.value !== '') {
                                    const filtered = initial.filter((e)=> {
                                        return e.name.toLowerCase().startsWith(value.target.value.toLowerCase())
                                    })
                                    return this.setState({ cryptos: filtered }) 
                                }
                                return this.setState({ cryptos: initial })
                                }}
                            style={{ width: 200 }}
                        />
                    </div>

                    <div className="currency-input">
                        <div className="change-currency">
                            <Select defaultValue="USD" onChange={this.changeCurrency}>
                                <Option value="USD">USD</Option>
                                <Option value="EUR">EUR</Option>
                                <Option value="LTC">LTC</Option>
                                <Option value="BTC">BTC</Option>
                            </Select>
                        </div>
                        <div className="input-number"> 
                            <InputNumber min={1} max={500} defaultValue={this.state.size} onChange={this.changeSize} />
                        </div>
                    </div>
                </div>
                {
                    loader === true ? <div className="spinner-position"><Spin /></div> :
                    <Table
                        className="cryptos-list-table"
                        size="middle"
                        dataSource={data}
                    >
                        <Table.Column
                            title="#"
                            dataIndex="id"
                            key="id"
                            width="5%"
                            align="left"
                            filteredValue="marketCap"
                            sorter={(a,b) => a.id - b.id}
                            render={id => id}
                        />
                        <Table.Column
                            title="Name"
                            dataIndex="name"
                            key="name"
                            width="5%"
                            align="left"
                            sorter={(a,b) => a.name.localeCompare(b.name)}
                            render={name => name}
                        />
                        <Table.Column
                            title="Market Cap"
                            dataIndex="marketCap"
                            key="marketCap"
                            width="20%"
                            align="right"
                            filteredValue="marketCap"
                            sorter={(a, b) => a.marketCap - b.marketCap }   
                            render={(text, record) => <span>{signs[currency]}{formatNumber(record.marketCap)}</span>}
                        />
                        <Table.Column
                            title="Price"
                            dataIndex="price"
                            key="price"
                            width="20%"
                            align="right"
                            filteredValue="price"
                            sorter={(a, b) => a.price - b.price}
                            render={(text, record) => <span className="blue">{signs[currency]}{record.price}</span>}
                        />
                        <Table.Column
                            title="Volume (24h)"
                            dataIndex="volume"
                            key="volume"
                            width="15%"
                            align="right" 
                            filteredValue="volume"
                            sorter={(a, b) => a.volume - b.volume}
                            render={(text, record) => <span className="blue">{signs[currency]}{formatNumber(record.volume)}</span>}
                        />
                        <Table.Column
                            title="Circulating Supply"
                            dataIndex="circulating_supply"
                            key="circulating_supply"
                            width="15%"
                            align="right"
                            filteredValue="circulating_supply"
                            sorter={(a, b) => a.circulating_supply - b.circulating_supply}
                            render={(text, record) => <span>{formatNumber(record.circulating_supply)} {record.symbole}</span>}
                        />
                        <Table.Column
                            title="Change (24h)"
                            dataIndex="change"
                            key="change"
                            width="15%"
                            align="right"
                            filteredValue="change"
                            sorter={(a, b) => a.change - b.change}
                            render={change => {
                                const str = change && String(change.toFixed(2)) ? String(change.toFixed(2) + ' %').replace(/\./g, ',') : ''
                                if (str.includes('-')) {
                                    return <div className="red">{str}</div>
                                }
                                return <div className="green">{str}</div>
                            }}
                        />
                        <Table.Column
                            title="View"
                            dataIndex="view"
                            key="view"
                            width="10%"
                            align="right" 
                            render={(text, record) => {
                                return <div>
                                    <Button type="primary" id={record.id} onClick={this.openModal}>View</Button>
                                    <Modal
                                        title="Cryptos' price evolution"
                                        mask={false}
                                        onCancel={this.closeModal}
                                        visible={Number(this.state.visible) === Number(record.id)}
                                        onOk={this.handleOk}
                                    >
                                        <AreaChart
                                            key={record.id}
                                            width={500}
                                            height={400}
                                            data={record.changes}
                                            margin={{
                                                top: 10,
                                                right: 30,
                                                left: 0,
                                                bottom: 0
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="key" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" />
                                        </AreaChart>
                                    </Modal>
                                </div>
                            }}
                        />
                    </Table>
                 }
            </Fragment>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setCurrency: (currency, size) => dispatch(setCurrency(currency, size))
})

export default connect(null, mapDispatchToProps)(Listing)
