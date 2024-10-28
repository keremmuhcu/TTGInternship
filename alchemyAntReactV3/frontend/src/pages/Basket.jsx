import React, { useState, useEffect } from 'react';
import { Table,Modal,Button, Popconfirm , message } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

const Basket = () => {
  const [moviesInTheBasket, setMoviesInTheBasket] = useState([]); 
  const [token, setToken] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('token');
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
      getMoviesFromBasket();
    } else {
      navigate('/login'); 
    }
  }, []);

  const getMoviesFromBasket = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/basket', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      // Gelen veriyi state'e kaydet
      setMoviesInTheBasket(response.data);
    })
    .catch(error => {
      console.error('Veri çekilirken bir hata oluştu:', error);
      // Token geçersizse kullanıcıyı login sayfasına yönlendir
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    });
  }

  const showDeleteModal = (movie = null) => {
    setSelectedMovie(movie)
    setIsDeleteModalOpen(true)
  }

  const deleteMovieById = (bid) => {
    setIsDeleteModalOpen(false)
    const token = localStorage.getItem('token');
    axios.delete(`http://127.0.0.1:5000/basket/delete/${bid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data.message, response.status);
        getMoviesFromBasket()
      })
      .catch(error => {
        console.error("Film silinirken bir hata oluştu", error);
      });
  };

  const columns = [
    {
      title: 'Film İsmi',
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => <a href={record.imdb_url} rel="noopener noreferrer" target="_blank">{record.title}</a>,
      onFilter: (value, record) => record.title.indexOf(value) === 0,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Gösterim Yılı',
      dataIndex: 'year',
      key: 'year',
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: 'IMDB Puanı',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: '',
      dataIndex: '',
      key: 'deletebasket',
      render: (_, record) =>
      <Popconfirm
        title="Sepetten kaldır"
        description="Sepetten kaldırmak istediğinize emin misiniz?"
        onConfirm={() => deleteMovieById(record.bid)}
        okText="Yes"
        cancelText="No"
      >
        <DeleteFilled style={{ fontSize: '16px', color: '#FF0000' }} />
      </Popconfirm> ,
    },
    
  ];
  return (
    <>
    {token && (
      <div className='table-container'>
        <h1>Sepet</h1>
          <Table
            columns={columns}
            dataSource={moviesInTheBasket}
            style={{ width: '50%' }}
          />
    </div>
    )}


    </>
  );
};

export default Basket