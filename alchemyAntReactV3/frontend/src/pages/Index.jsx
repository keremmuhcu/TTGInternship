import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, message, Upload, FloatButton } from 'antd';
import { DeleteFilled, EditFilled, UploadOutlined, DownloadOutlined, LogoutOutlined, PlusCircleFilled, ShoppingCartOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const { Search } = Input;

const Index = () => {
  const [movies, setMovies] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Debounce fonksiyonu
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('token');
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      navigate('/login'); 
    }
  }, []);

  const infoMessage = (errorMesage, type) => {
    messageApi.open({
      type: type,
      content: errorMesage,
    });
  };


  const downloadExcel = () => {
    if (movies.length != 0) {
      const ws = XLSX.utils.json_to_sheet(movies);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Movies");
      XLSX.writeFile(wb, "Movies.xlsx");
    } else {
      infoMessage("İndirilecek öğe yok.", "error")
    }
  };

  const handleUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setMovies(worksheet);
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isXLSX) {
        infoMessage('XLSX formatında bir dosya seçiniz.', "error");
      }
      return isXLSX || Upload.LIST_IGNORE;
    },
    customRequest: handleUpload,
    showUploadList: false,
  };

  const showModal = (movie = null) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    if (movie) {
      form.setFieldsValue(movie);
    } else {
      form.resetFields();
    }
  };

  const showDeleteModal = (movie = null) => {
    setSelectedMovie(movie)
    setIsDeleteModalOpen(true)
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      if (selectedMovie) {
        updateMovie(selectedMovie.mid, values);
      } else {
        addMovie(values);
      }
      setIsModalOpen(false);
      form.resetFields();
    }).catch(info => {
      console.log('Boş alanlar var:', info);
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const getMovies = () => {
    if (token) {
      axios.get('http://127.0.0.1:5000/', {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
        .then(response => {
          setMovies(response.data);
        })
        .catch(error => {
          if (error.response) {
            console.error("Filmler getirilirken bir hata oluştu", error);
            infoMessage("Filmler alınamadı", "error")
          }
        });
    } else {
      infoMessage("Lütfen giriş yapınız.", "error")
    }
  };

  const deleteMovieById = (mid) => {
    setIsDeleteModalOpen(false)
    const token = localStorage.getItem('token');
    axios.delete(`http://127.0.0.1:5000/delete/${mid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data.message, response.status);
        getMovies();
      })
      .catch(error => {
        console.error("Film silinirken bir hata oluştu", error);
        infoMessage("Film silinirken bir hata oluştu", "error")
      });
  };

  const addMovie = (movie) => {
    const token = localStorage.getItem('token');
    axios.post('http://127.0.0.1:5000/movies', movie, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data.message);
        getMovies(); 
      })
      .catch(error => {
        console.error("Film eklenirken bir hata oluştu", error);
        infoMessage("Film eklenirken bir hata oluştu", "error")
      });
  };

  const updateMovie = (mid, updatedMovie) => {
    const token = localStorage.getItem('token');
    axios.put(`http://127.0.0.1:5000/movies/${mid}`, updatedMovie, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response.data.message);
        getMovies(); 
      })
      .catch(error => {
        console.error("Film güncellenirken bir hata oluştu", error);
        infoMessage("Film güncellenirken bir hata oluştu", "error")
      });
  };

  const addToBasket = (mid) => {
    const token = localStorage.getItem('token');
    axios.post(`http://127.0.0.1:5000/add/${mid}`, mid , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log(response.data.message);
      infoMessage("Sepete eklendi", "success")
    })
    .catch(error => {
      console.error("Sepete eklenirken bir hata oluştu", error);
      infoMessage("Sepete eklenirken bir hata oluştu", "error")
    })
  }

  // Debounce'lı arama fonksiyonu
  const debouncedSearch = debounce(async (searchTerm) => {
    if (token) {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/?title=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMovies(response.data); 
      } catch (error) {
        console.error("Arama sırasında hata oluştu", error);
        infoMessage("Arama sırasında hata oluştu", "error");
      }
    } else {
      infoMessage("Lütfen giriş yapınız.", "error");
    }
  }, 1000); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setToken(null); 
    navigate('/login'); 
  };

  const handleBasket = () => {
    navigate('/basket'); 
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
      key: 'delete',
      render: (_, record) => <DeleteFilled style={{ fontSize: '16px', color: '#FF0000' }} onClick={() => showDeleteModal(record)} />,
    },
    {
      title: '',
      dataIndex: '',
      key: 'edit',
      render: (_, record) => <EditFilled style={{ fontSize: '16px', color: '#1677ff' }} onClick={() => showModal(record)} />,
    },
    {
      title: '',
      dataIndex: '',
      key: 'add',
      render: (_, record) => <PlusCircleOutlined style={{ fontSize: '16px' }} onClick={() => addToBasket(record.mid)} />,
    }
  ];

  return (
    <>
      {contextHolder}
      <FloatButton
        icon={<DownloadOutlined />}
        type="default"
        style={{
          insetInlineEnd: 94,
        }}
        onClick={downloadExcel}
      />
      <div className='header-btn-container'>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} style={{ marginRight: 20 }}>Yükle</Button>
        </Upload>
        <Button  icon={<ShoppingCartOutlined />} style={{ marginRight: 20 }} onClick={handleBasket}>
          Sepet
        </Button>
        <Button type="primary" onClick={handleLogout} icon={<LogoutOutlined />}>
          Çıkış
        </Button>

      </div>
      <div className='table-container'>
        <Search
          placeholder="Film ara..."
          onKeyUp={(e) => {
            const searchTerm = e.target.value; 
            debouncedSearch(searchTerm); 
          }} 
          enterButton
          style={{ width: "400px", marginBottom: '30px' }}
        />
        <Table
          dataSource={movies}
          columns={columns}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            total: movies.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} film`,
          }}
          style={{ width: '50%' }}
        />

        <div className='table-btn-container'>
          <Button type='primary' onClick={getMovies}>Getir</Button>
          <Button type='primary' onClick={() => showModal()}>Film Ekle</Button>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        title={selectedMovie ? "Filmi Düzenle" : "Film Ekle"} 
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            İptal
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {selectedMovie ? "Güncelle" : "Ekle"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="movieForm"
          style={{ maxWidth: 600 }}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            hasFeedback
            label="Film Adı"
            name="title"
            rules={[{ required: true, message: 'Film adı girilmesi zorunludur!' }]}
          >
            <Input placeholder="" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Gösterim Yılı"
            name="year"
            rules={[
              { required: true, message: 'Gösterim yılı girilmesi zorunludur!' },
              { type: 'number', min: 1888, max: new Date().getFullYear(), message: `Gösterim yılı 1888 ile ${new Date().getFullYear()} arasında olmalıdır.` }
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="IMDB Puanı"
            name="score"
            rules={[
              { required: true, message: 'IMDB puanı girilmesi zorunludur!' }
            ]}
          >
            <InputNumber max={10.0} min={1.0} step={0.1} />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="IMDB Sayfası"
            name="imdb_url"
            rules={[{ required: true, message: 'IMDB URL girilmesi zorunludur!' }]}
          >
            <Input placeholder="" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        title="Filmi Sil"
        onOk={() => deleteMovieById(selectedMovie.mid)}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsDeleteModalOpen(false)}>İptal</Button>,
          <Button key="delete" type='primary' onClick={() => deleteMovieById(selectedMovie.mid)}>Sil</Button>
        ]}
      >
        <p>{selectedMovie ? selectedMovie.title + " filmi silinecek.": ""}</p>
      </Modal>

    </>
  );
};

export default Index;