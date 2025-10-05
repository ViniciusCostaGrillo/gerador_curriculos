<?php
class Formacao {
    private $conn;
    private $table_name = "formacoes";

    public $id;
    public $curriculo_id;
    public $instituicao;
    public $curso;
    public $nivel;
    public $data_inicio;
    public $data_fim;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table_name . "
                SET curriculo_id=:curriculo_id, instituicao=:instituicao, 
                    curso=:curso, nivel=:nivel, data_inicio=:data_inicio, 
                    data_fim=:data_fim, status=:status";

        $stmt = $this->conn->prepare($query);

        // Sanitização
        $this->curriculo_id = htmlspecialchars(strip_tags($this->curriculo_id));
        $this->instituicao = htmlspecialchars(strip_tags($this->instituicao));
        $this->curso = htmlspecialchars(strip_tags($this->curso));
        $this->nivel = htmlspecialchars(strip_tags($this->nivel));
        $this->data_inicio = htmlspecialchars(strip_tags($this->data_inicio));
        $this->data_fim = htmlspecialchars(strip_tags($this->data_fim));
        $this->status = htmlspecialchars(strip_tags($this->status));

        // Bind
        $stmt->bindParam(":curriculo_id", $this->curriculo_id);
        $stmt->bindParam(":instituicao", $this->instituicao);
        $stmt->bindParam(":curso", $this->curso);
        $stmt->bindParam(":nivel", $this->nivel);
        $stmt->bindParam(":data_inicio", $this->data_inicio);
        $stmt->bindParam(":data_fim", $this->data_fim);
        $stmt->bindParam(":status", $this->status);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function buscarPorCurriculo($curriculo_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                WHERE curriculo_id = :curriculo_id 
                ORDER BY data_inicio DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':curriculo_id', $curriculo_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>