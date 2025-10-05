<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
class Curriculo {
    private $conn;
    private $table_name = "curriculos";

    public $id;
    public $nome_completo;
    public $email;
    public $telefone;
    public $endereco;
    public $cidade;
    public $estado;
    public $cep;
    public $data_nascimento;
    public $estado_civil;
    public $objetivo;
    public $resumo_profissional;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table_name . "
                SET nome_completo=:nome_completo, email=:email, telefone=:telefone,
                    endereco=:endereco, cidade=:cidade, estado=:estado, cep=:cep,
                    data_nascimento=:data_nascimento, estado_civil=:estado_civil,
                    objetivo=:objetivo, resumo_profissional=:resumo_profissional";

        $stmt = $this->conn->prepare($query);

        // Sanitização
        $this->nome_completo = htmlspecialchars(strip_tags($this->nome_completo));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->telefone = htmlspecialchars(strip_tags($this->telefone));
        $this->endereco = htmlspecialchars(strip_tags($this->endereco));
        $this->cidade = htmlspecialchars(strip_tags($this->cidade));
        $this->estado = htmlspecialchars(strip_tags($this->estado));
        $this->cep = htmlspecialchars(strip_tags($this->cep));
        $this->data_nascimento = htmlspecialchars(strip_tags($this->data_nascimento));
        $this->estado_civil = htmlspecialchars(strip_tags($this->estado_civil));
        $this->objetivo = htmlspecialchars(strip_tags($this->objetivo));
        $this->resumo_profissional = htmlspecialchars(strip_tags($this->resumo_profissional));

        // Bind
        $stmt->bindParam(":nome_completo", $this->nome_completo);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":telefone", $this->telefone);
        $stmt->bindParam(":endereco", $this->endereco);
        $stmt->bindParam(":cidade", $this->cidade);
        $stmt->bindParam(":estado", $this->estado);
        $stmt->bindParam(":cep", $this->cep);
        $stmt->bindParam(":data_nascimento", $this->data_nascimento);
        $stmt->bindParam(":estado_civil", $this->estado_civil);
        $stmt->bindParam(":objetivo", $this->objetivo);
        $stmt->bindParam(":resumo_profissional", $this->resumo_profissional);

        if($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function buscarPorId($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function listarTodos() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>