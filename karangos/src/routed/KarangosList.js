import { useState, useEffect } from 'react'
import axios from 'axios'
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function KarangosList() {
  const classes = useStyles()

  // Variáveis que conterão dados PRECISAM ser inicializadas como vetores vazios
  const [karangos, setKarangos] = useState([])

  useEffect(() => {
    async function getData() {
      try { // tenta buscar os dados
        let response = await axios.get('https://api.faustocintra.com.br/karangos')
        setKarangos(response.data)
      }
      catch(error) {
        console.error(error)
      }
    }
    getData()
  }, []) // Quando a lista de dependências é um vetor vazio, o useEffect()
         // é executado apenas uma vez, no carregamento inicial do componente

  return (
    <>
      <h1>Listagem de Karangos</h1>
      <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Cód.</TableCell>
            <TableCell>Marca</TableCell>
            <TableCell>Modelo</TableCell>
            <TableCell>Cor</TableCell>
            <TableCell>Ano</TableCell>
            <TableCell align="center">Importado?</TableCell>
            <TableCell>Placa</TableCell>
            <TableCell align="right">Preço</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {karangos.map((karango) => (
            <TableRow key={karango.id}>
              <TableCell>{karango.id}</TableCell>
              <TableCell>{karango.marca}</TableCell>
              <TableCell>{karango.modelo}</TableCell>
              <TableCell>{karango.cor}</TableCell>
              <TableCell>{karango.ano_fabricacao}</TableCell>
              <TableCell align="center">
                <Checkbox checked={karango.importado == 1} readonly="readonly" />
              </TableCell>
              <TableCell>{karango.placa}</TableCell>
              <TableCell align="right">
                { Number(karango.preco).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableContainer>      
    </>
  )
}