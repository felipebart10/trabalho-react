import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import InputMask from 'react-input-mask'
import { makeStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import React from 'react'

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    maxWidth: '80%',
    margin: '0 auto',
    '& .MuiFormControl-root': {
      minWidth: '200px',
      maxWidth: '500px',
      margin: '0 24px 24px 0'
    }
  },
  toolbar: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: '36px'
  }
}))

export default function KarangosForm() {
  const classes = useStyles()

  // Classes de caracters para a máscara da placa
  // 1) Três primeiras posições, somente letras (maiúsculas ou minúsculas) ~> [A-Za-z]
  // 2) Quinta, sétima e oitava posições, somente dígitos ~> [0-9]
  // 3) Sexta posição: dígitos ou letras (maiúsculas ou minúsculas) de A a J ~> [0-9A-Ja-j]
  const formatChars = {
    'A': '[A-Za-z]',
    '0': '[0-9]',
    '#': '[0-9A-Ja-j]'
  }

  // Máscara de entrada para a placa
  const placaMask = 'AAA-0#00'

  // Máscara para CPF: '000.000.000-00'
  const cpfMask = '000.000.000-00'
  // Máscara para RG: '00.000.000-#'
  const rgMask = '00.000.000-#'

  const [karango, setKarango] = useState({
    id: null,
    nome: '',
    cpf: '',
    rg: '',
    logradouro: '', 
    num_imovel: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    telefone: '',
    email: ''
  })
  const [currentId, setCurrentId] = useState()

  const [sendBtnStatus, setSendBtnStatus] = useState({
    disabled: false,
    label: 'Enviar'
  })

  const [sbStatus, setSbStatus] = useState({
    open: false,
    severity: 'success',
    message: '' 
  })

  const [error, setError] = useState({
    nome: '',
    cpf: '',
    rg: '',
    logradouro: '', 
    num_imovel: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    telefone: '',
    email: ''
  })

  //const [isValid, setIsValid] = useState(false)

  const [isModified, setIsModified] = useState(false)

  const history = useHistory()
  const params = useParams()
  // useEffect() para quando o formulário for carregado (só na inicialização)
  useEffect(() => {
    // Verificamos se a rota atual contém o parâmetro id
    // Em caso positivo, buscamos os dados no back-end e carregamos o formulário para edição
    if(params.id) {
      setTitle('Editar karango')
      getData(params.id)
    }
  }, [])
  
  async function getData(id) {
    try {
      let response = await axios.get(`https://api.faustocintra.com.br/clientes/${id}`)
      setKarango(response.data)
    }
    catch(error) {
      setSbStatus({
        open: true,
        severity: 'error',
        message: 'Não foi possível carregar os dados para edição.'
      })
    }
  }

  function handleInputChange(event, property) {

    const newKarango = {...karango}

    setCurrentId(event.target.id)
    if(event.target.id) property = event.target.id

    else {
      // Quando o nome de uma propriedade de objeto aparece entre [],
      // significa que o nome da propriedade será determinado pela
      // variável ou expressão contida dentro dos colchetes
      newKarango[property] = event.target.value
    }
    setKarango(newKarango)
    validate(newKarango)  // Dispara a validação
    setIsModified(true)   // O formulário foi modificado
  }

  function validate(info) {
    let valid = true

    const newError = {
      nome: '',
      cpf: '',
      rg: '',
      logradouro: '', 
      num_imovel: '',
      complemento: '',
      bairro: '',
      municipio: '',
      uf: '',
      telefone: '',
      email: ''
    }

    // trim(): retira espaços em branco do início e do final de uma string
    if(info.nome.trim() === '') {
      errorTemp.nome = 'O nome deve ser preenchido'
      isValid = false
    }     

    if(info.cpf.trim() === '') {
      errorTemp.cpf = 'O CPF deve ser preenchido'
      isValid = false
    }

    if(info.rg.trim() === '') {
      errorTemp.rg = 'O RG deve ser informada'
      isValid = false
    }

    // A placa não pode ser string vazia nem conter sublinhado
    if(info.logradouro.trim() === '') {
      errorTemp.logradouro = 'O endereço deve ser preenchido'
      isValid = false
    }

    // O preço deve ser numérico e maior que zero
    if(isNaN(info.num_imovel)) {
      errorTemp.num_imovel = 'O número do imóvel deve ser preenchido'
      isValid = false
    }

    if(info.bairro.trim() === '') {
      errorTemp.bairro = 'O bairro deve ser preenchido'
      isValid = false
    }

    if(info.municipio.trim() === '') {
      errorTemp.municipio = 'O município deve ser preenchido'
      isValid = false
    }
    if(info.uf.trim() === '') {
      errorTemp.uf = 'O estado deve ser preenchido'
      isValid = false
    }
    if(info.telefone.trim() === '') {
      errorTemp.telefone = 'O telefone deve ser preenchido'
      isValid = false
    }
    if(info.email.trim() === '') {
      errorTemp.email = 'O e-mail deve ser preenchido'
      isValid = false
    }

    setError(newError)
    setIsValid(valid)
    return valid
  }

  async function saveData() {
    try {
      // Desabilita o botão de enviar para evitar envios duplicados
      setSendBtnStatus({disabled: true, label: 'Enviando...'})
      
      await axios.post('https://api.faustocintra.com.br/clientes', karango)
      
      // Mostra a SnackBar
      setSbStatus({open: true, severity: 'success', message: 'Dados salvos com sucesso!'})
      
    }
    catch(error) {
      // Mostra a SnackBar
      setSbStatus({open: true, severity: 'error', message: 'ERRO: ' + error.message})
    }
    // Restaura o estado inicial do botão de envio
    setSendBtnStatus({disabled: false, label: 'Enviar'})
  }

  function handleSubmit(event) {

    event.preventDefault()    // Evita que a página seja recarregada

    saveData()

  }

  function handleSbClose() {
    setSbStatus({...sbStatus, open: false})

    // Retorna para a página de listagem em caso de sucesso
    if(sbStatus.severity === 'success') history.push('/list')
  }

  return (
    <>
      <Snackbar open={sbStatus.open} autoHideDuration={6000} onClose={handleSbClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSbClose} severity={sbStatus.severity}>
          {sbStatus.message}
        </MuiAlert>
      </Snackbar>

      <h1>{title}</h1>
      <form className={classes.form} onSubmit={handleSubmit}>
        
        <TextField 
          id="nome" 
          label="Nome" 
          variant="filled"
          value={karango.nome}
          onChange={handleInputChange}
          required  /* not null, precisa ser preenchido */
          placeholder="Nome completo"
          fullWidth
          error={error.nome !== ''}
          helperText={error.nome}
        />

        <InputMask
          id="cpf" 
          mask={cpfMask}
          formatChars={formatChars}
          value={karango.cpf}
          onChange={(event) => handleInputChange(event, 'cpf')}
        >
          {() => <TextField 
            label="CPF" 
            variant="filled"
            required  /* not null, precisa ser preenchido */
            placeholder="Informe o CPF"
            fullWidth
            error={error.cpf !== ''}
            helperText={error.cpf}
          />}
        </InputMask>

        <InputMask
          id="rg" 
          mask={rgMask}
          formatChars={formatChars}
          value={karango.rg}
          onChange={(event) => handleInputChange(event, 'rg')}
        >
          {() => <TextField 
            label="rg" 
            variant="filled"
            required  /* not null, precisa ser preenchido */
            placeholder="Informe o RG"
            fullWidth
            error={error.rg !== ''}
            helperText={error.rg}
          />}
        </InputMask>

        <TextField 
          id="logradouro" 
          label="Logradouro" 
          variant="filled"
          value={karango.logradouro}
          onChange={event => handleInputChange(event, 'logradouro')}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o endereço"
          fullWidth
          error={error.logradouro !== ''}
          helperText={error.logradouro}
        />

        <TextField 
          id="num_imovel" 
          label="Nº" 
          variant="filled"
          value={karango.num_imovel}
          onChange={event => handleInputChange(event, 'num_imovel')}
          required  /* not null, precisa ser preenchido */
          placeholder="Nº"
          fullWidth
        />

        <TextField 
          id="complemento" 
          label="Complemento" 
          variant="filled"
          value={karango.complemento}
          onChange={event => handleInputChange(event, 'complemento')}
          placeholder="Apartamento, bloco, caixa postal etc"
          fullWidth
        />

        <TextField 
          id="bairro" 
          label="Bairro" 
          variant="filled"
          value={karango.bairro}
          onChange={event => handleInputChange(event, 'bairro')}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o bairro"
          fullWidth
        />

        <TextField 
          id="municipio" 
          label="Município" 
          variant="filled"
          value={karango.municipio}
          onChange={event => handleInputChange(event, 'municipio')}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o município"
          fullWidth
        />

        <TextField 
          id="uf" 
          label="UF" 
          variant="filled"
          value={karango.uf}
          onChange={event => handleInputChange(event, 'uf')}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o estado"
          fullWidth
        />

        <TextField 
          id="telefone" 
          label="Telefone" 
          variant="filled"
          value={karango.telefone}
          onChange={event => handleInputChange(event, 'telefone')}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o telefone"
          fullWidth
        />

        <TextField 
          id="email" 
          label="e-mail" 
          variant="filled"
          value={karango.email}
          onChange={event => handleInputChange(event, 'email')}
          required  /* not null, precisa ser preenchido */
          placeholder="Informe o e-mail"
          fullWidth
        />

        <Toolbar className={classes.toolbar}>
          <Button type="submit" variant="contained" color="secondary" disabled={sendBtnStatus.disabled}>
            {sendBtnStatus.label}
          </Button>
          <Button variant="contained">Voltar</Button>
        </Toolbar>

        <div>
          {JSON.stringify(karango)}
          <br />
          currentId: {JSON.stringify(currentId)}
          <br />
          isValid: {JSON.stringify(isValid)}
          <br />
          isModified: {JSON.stringify(isModified)}
        </div>
      </form>
    </>
  )
}